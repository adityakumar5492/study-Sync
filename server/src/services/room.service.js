const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const Room = require("../models/room.model");
const Message = require("../models/message.model");
const {
    createActivity,
} = require("./activity.service");

const generateInviteCode = () => {
    return crypto.randomBytes(4).toString("hex").toUpperCase();
};

/**
 * Delete a PDF file from the server.
 */
const deletePdfFile = async (pdfUrl) => {
    if (!pdfUrl) {
        return;
    }

    const relativePath = pdfUrl.replace(/^\/+/, "");

    const filePath = path.join(
        __dirname,
        "../..",
        relativePath
    );

    try {
        await fs.promises.unlink(filePath);
    } catch (error) {
        if (error.code === "ENOENT") {
            return;
        }

        throw error;
    }
};

/**
 * Format room response based on user role.
 */
const formatRoomResponse = (room, userId) => {
    const roomObj = room.toObject();

    const isHost =
        roomObj.host._id
            ? roomObj.host._id.toString() ===
              userId.toString()
            : roomObj.host.toString() ===
              userId.toString();

    if (!isHost) {
        delete roomObj.inviteCode;
    }

    return roomObj;
};

const createRoom = async (userId, data) => {
    const {
        name,
        description = "",
        isPrivate = false,
        maxMembers = 50,
    } = data;

    let inviteCode;

    while (true) {
        inviteCode = generateInviteCode();

        const roomExists = await Room.findOne({
            inviteCode,
        });

        if (!roomExists) {
            break;
        }
    }

    const room = await Room.create({
        name,
        description,
        host: userId,
        members: [userId],
        inviteCode,
        isPrivate,
        maxMembers,
    });
    await createActivity(
        userId,
        "room_created",
        room._id
    );

    const populatedRoom = await Room.findById(
        room._id
    )
        .populate(
            "host",
            "name email avatar"
        )
        .populate(
            "members",
            "name email avatar"
        )
        .populate(
            "removedMembers.user",
            "name email avatar"
        );

    return formatRoomResponse(
        populatedRoom,
        userId
    );
};

const getAllRooms = async (userId) => {
    const rooms = await Room.find({
        isActive: true,
    })
        .populate(
            "host",
            "name email avatar"
        )
        .select("-__v -inviteCode")
        .sort({ createdAt: -1 });

    return rooms;
};

const getRoomById = async (
    roomId,
    userId
) => {
    const room = await Room.findById(roomId)
        .populate(
            "host",
            "name email avatar"
        )
        .populate(
            "members",
            "name email avatar"
        )
        .populate(
            "removedMembers.user",
            "name email avatar"
        )
        .populate(
            "rejoinRequests.user",
            "name email avatar"
        );
    
    if (!room) {
        throw new Error("Room not found.");
    }

    // Public room → everyone can access
        if (!room.isPrivate) {
            return formatRoomResponse(
                room,
                userId
            );
        }
    // Host can access
    const isHost =
        room.host._id.toString() ===
        userId.toString();

    if (isHost) {
        return formatRoomResponse(
            room,
            userId
        );
    }

    // Existing member can access
    const isMember = room.members.some(
        (member) =>
            member._id.toString() ===
            userId.toString()
    );

    if (!isMember) {
        throw new Error(
            "You must join this room first."
        );
    }

    return formatRoomResponse(
        room,
        userId
    );
};

const joinRoom = async (
    userId,
    inviteCode
) => {
    if (
        !inviteCode ||
        typeof inviteCode !== "string" ||
        !inviteCode.trim()
    ) {
        throw new Error(
            "Invite code is required."
        );
    }

    const room = await Room.findOne({
        inviteCode: inviteCode
            .trim()
            .toUpperCase(),
        isActive: true,
    });

    if (!room) {
        throw new Error(
            "Invalid invite code."
        );
    }

    // Previously removed users cannot directly rejoin.
    const wasRemoved =
        room.removedMembers?.some(
            (entry) =>
                entry.user.toString() ===
                userId.toString()
        );

    if (wasRemoved) {
        throw new Error(
            "You were previously removed from this room. Please request permission from the host to rejoin."
        );
    }

    const isMember = room.members.some(
        (member) =>
            member.toString() ===
            userId.toString()
    );

    if (isMember) {
        throw new Error(
            "You are already a member of this room."
        );
    }

    if (
        room.members.length >=
        room.maxMembers
    ) {
        throw new Error("Room is full.");
    }

    room.members.push(userId);

    await room.save();
        await createActivity(
        userId,
        "room_joined",
        room._id
    );

    const populatedRoom =
        await Room.findById(room._id)
            .populate(
                "host",
                "name email avatar"
            )
            .populate(
                "members",
                "name email avatar"
            )
            .populate(
                "removedMembers.user",
                "name email avatar"
            );

    return formatRoomResponse(
        populatedRoom,
        userId
    );
};

const leaveRoom = async (
    userId,
    roomId
) => {
    const room =
        await Room.findById(roomId);

    if (!room) {
        throw new Error(
            "Room not found."
        );
    }

    if (
        room.host.toString() ===
        userId.toString()
    ) {
        throw new Error(
            "Host cannot leave the room. Delete the room instead."
        );
    }

    const isMember =
        room.members.some(
            (member) =>
                member.toString() ===
                userId.toString()
        );

    if (!isMember) {
        throw new Error(
            "You are not a member of this room."
        );
    }

    room.members =
        room.members.filter(
            (member) =>
                member.toString() !==
                userId.toString()
        );

    await room.save();

    await createActivity(
        userId,
        "room_left",
        room._id
    );

    const populatedRoom =
        await Room.findById(room._id)
            .populate(
                "host",
                "name email avatar"
            )
            .populate(
                "members",
                "name email avatar"
            )
            .populate(
                "removedMembers.user",
                "name email avatar"
            );

    return formatRoomResponse(
        populatedRoom,
        userId
    );
};

const deleteRoom = async (
    userId,
    roomId
) => {
    const room =
        await Room.findById(roomId);

    if (!room) {
        throw new Error(
            "Room not found."
        );
    }

    if (
        room.host.toString() !==
        userId.toString()
    ) {
        throw new Error(
            "Only the host can delete this room."
        );
    }

    if (room.pdfUrl) {
        await deletePdfFile(
            room.pdfUrl
        );
    }

    await Room.findByIdAndDelete(
        roomId
    );

    return true;
};

const updateRoom = async (
    userId,
    roomId,
    data
) => {
    const room =
        await Room.findById(roomId);

    if (!room) {
        throw new Error(
            "Room not found."
        );
    }

    if (
        room.host.toString() !==
        userId.toString()
    ) {
        throw new Error(
            "Only the host can update this room."
        );
    }

    const {
        name,
        description,
        isPrivate,
        maxMembers,
    } = data;

    if (name !== undefined) {
        room.name = name;
    }

    if (
        description !== undefined
    ) {
        room.description =
            description;
    }

    if (
        isPrivate !== undefined
    ) {
        room.isPrivate = isPrivate;
    }

    if (
        maxMembers !== undefined
    ) {
        room.maxMembers =
            maxMembers;
    }

    await room.save();

    const populatedRoom =
        await Room.findById(room._id)
            .populate(
                "host",
                "name email avatar"
            )
            .populate(
                "members",
                "name email avatar"
            )
            .populate(
                "removedMembers.user",
                "name email avatar"
            );

    return formatRoomResponse(
        populatedRoom,
        userId
    );
};

const uploadRoomPdf = async (
    userId,
    roomId,
    file
) => {
    const room =
        await Room.findById(roomId);

    if (!room) {
        throw new Error(
            "Room not found."
        );
    }

    if (
        room.host.toString() !==
        userId.toString()
    ) {
        throw new Error(
            "Only the host can upload study material."
        );
    }

    if (!file) {
        throw new Error(
            "PDF file is required."
        );
    }

    const oldPdfUrl =
        room.pdfUrl;

    room.pdfUrl =
        `/uploads/pdfs/${file.filename}`;

    await room.save();

    if (oldPdfUrl) {
        try {
            await deletePdfFile(
                oldPdfUrl
            );
        } catch (error) {
            console.error(
                "Failed to delete old PDF:",
                error
            );
        }
    }

    const populatedRoom =
        await Room.findById(room._id)
            .populate(
                "host",
                "name email avatar"
            )
            .populate(
                "members",
                "name email avatar"
            )
            .populate(
                "removedMembers.user",
                "name email avatar"
            );

    return formatRoomResponse(
        populatedRoom,
        userId
    );
};

const deleteRoomPdf = async (
    userId,
    roomId
) => {
    const room =
        await Room.findById(roomId);

    if (!room) {
        throw new Error(
            "Room not found."
        );
    }

    if (
        room.host.toString() !==
        userId.toString()
    ) {
        throw new Error(
            "Only the host can delete study material."
        );
    }

    if (!room.pdfUrl) {
        throw new Error(
            "No PDF is currently uploaded."
        );
    }

    const oldPdfUrl =
        room.pdfUrl;

    room.pdfUrl = "";

    await room.save();

    try {
        await deletePdfFile(
            oldPdfUrl
        );
    } catch (error) {
        console.error(
            "Failed to delete PDF file:",
            error
        );
    }

    const populatedRoom =
        await Room.findById(room._id)
            .populate(
                "host",
                "name email avatar"
            )
            .populate(
                "members",
                "name email avatar"
            )
            .populate(
                "removedMembers.user",
                "name email avatar"
            );

    return formatRoomResponse(
        populatedRoom,
        userId
    );
};

const getRoomMessages = async (
    userId,
    roomId
) => {
    const room =
        await Room.findById(roomId);

    if (!room) {
        throw new Error(
            "Room not found."
        );
    }

    const isHost =
        room.host.toString() ===
        userId.toString();

    const isMember =
        room.members.some(
            (member) =>
                member.toString() ===
                userId.toString()
        );

    if (!isHost && !isMember) {
        throw new Error(
            "You must join this room first."
        );
    }

    const messages =
        await Message.find({
            room: roomId,
        })
            .populate(
                "sender",
                "name avatar"
            )
            .sort({
                createdAt: 1,
            })
            .limit(100);

    return messages;
};

const requestRejoin = async (userId, roomId) => {
    const room = await Room.findById(roomId);

    if (!room) {
        throw new Error("Room not found.");
    }

    const isMember = room.members.some(
        (member) =>
            member.toString() === userId.toString()
    );

    if (isMember) {
        throw new Error(
            "You are already a member of this room."
        );
    }

    const removedEntry = room.removedMembers?.find(
        (entry) =>
            entry.user.toString() === userId.toString()
    );

    if (!removedEntry) {
        throw new Error(
            "You have not been removed from this room."
        );
    }

    const existingRequest =
        room.rejoinRequests?.find(
            (request) =>
                request.user.toString() ===
                    userId.toString() &&
                request.status === "pending"
        );

    if (existingRequest) {
        throw new Error(
            "Your rejoin request is already pending."
        );
    }

    room.rejoinRequests.push({
        user: userId,
        status: "pending",
    });

    await room.save();

    return true;
};


const approveRejoinRequest = async (
    hostId,
    roomId,
    userId
) => {
    const room = await Room.findById(roomId);

    if (!room) {
        throw new Error("Room not found.");
    }

    if (
        room.host.toString() !== hostId.toString()
    ) {
        throw new Error(
            "Only the host can approve rejoin requests."
        );
    }

    const request = room.rejoinRequests?.find(
        (item) =>
            item.user.toString() ===
                userId.toString() &&
            item.status === "pending"
    );

    if (!request) {
        throw new Error(
            "Rejoin request not found."
        );
    }

    const alreadyMember = room.members.some(
        (member) =>
            member.toString() === userId.toString()
    );

    if (!alreadyMember) {
        if (
            room.members.length >=
            room.maxMembers
        ) {
            throw new Error("Room is full.");
        }

        room.members.push(userId);
    }

    request.status = "approved";

    await room.save();

    await createActivity(
        userId,
        "room_rejoined",
        room._id
    );

    return true;
};


const rejectRejoinRequest = async (
    hostId,
    roomId,
    userId
) => {
    const room = await Room.findById(roomId);

    if (!room) {
        throw new Error("Room not found.");
    }

    if (
        room.host.toString() !== hostId.toString()
    ) {
        throw new Error(
            "Only the host can reject rejoin requests."
        );
    }

    const request = room.rejoinRequests?.find(
        (item) =>
            item.user.toString() ===
                userId.toString() &&
            item.status === "pending"
    );

    if (!request) {
        throw new Error(
            "Rejoin request not found."
        );
    }

    request.status = "rejected";

    await room.save();

    return true;
};

module.exports = {
    createRoom,
    getAllRooms,
    getRoomById,
    joinRoom,
    leaveRoom,
    deleteRoom,
    updateRoom,
    uploadRoomPdf,
    deleteRoomPdf,
    getRoomMessages,

    requestRejoin,
    approveRejoinRequest,
    rejectRejoinRequest,
};