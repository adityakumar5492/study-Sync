const crypto = require("crypto");

const Room = require("../models/room.model");
const Message = require("../models/message.model");

const {
    createActivity,
    getSocketIO,
} = require("./activity.service");

const cloudinary = require("../config/cloudinary");

const ROOM_LIFETIME_MS =
    24 * 60 * 60 * 1000;

const generateInviteCode = () => {
    return crypto.randomBytes(4).toString("hex").toUpperCase();
};

/**
 * Check whether a room has expired.
 *
 * Rooms live for 24 hours from createdAt.
 */
const isRoomExpired = (room) => {
    if (!room?.createdAt) {
        return false;
    }

    const expiresAt =
        new Date(room.createdAt).getTime() +
        ROOM_LIFETIME_MS;

    return Date.now() >= expiresAt;
};

/**
 * Get room expiration time.
 */
const getRoomExpirationTime = (room) => {
    if (!room?.createdAt) {
        return null;
    }

    return new Date(
        new Date(room.createdAt).getTime() +
            ROOM_LIFETIME_MS
    );
};

/**
 * Delete PDF from Cloudinary.
 */
const deletePdfFromCloudinary = async (publicId) => {
    if (!publicId) {
        return;
    }

    try {
        await cloudinary.uploader.destroy(
            publicId,
            {
                resource_type: "raw",
            }
        );
    } catch (error) {
        console.error(
            "Failed to delete PDF from Cloudinary:",
            error
        );

        throw error;
    }
};

/**
 * Format room response based on user role.
 */
const formatRoomResponse = (room, userId) => {
    const roomObj = room.toObject();

    const hostId =
        roomObj.host?._id
            ? roomObj.host._id.toString()
            : roomObj.host?.toString();

    const isHost =
        hostId === userId.toString();

    if (!isHost) {
        delete roomObj.inviteCode;
    }

    return roomObj;
};

/**
 * Create Room
 */
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

        const roomExists =
            await Room.findOne({
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

/**
 * Get All Rooms
 *
 * IMPORTANT:
 * Every active and non-expired room
 * is visible to everyone.
 *
 * Expired rooms are excluded even if
 * the background cleanup has not run yet.
 */
const getAllRooms = async (userId) => {
    const expirationDate = new Date(
        Date.now() - ROOM_LIFETIME_MS
    );

    const rooms = await Room.find({
        isActive: true,
        createdAt: {
            $gt: expirationDate,
        },
    })
        .populate(
            "host",
            "name email avatar"
        )
        .populate(
            "members",
            "name email avatar"
        )
        .select("-__v -inviteCode")
        .sort({
            createdAt: -1,
        });

    return rooms;
};

/**
 * Get Room By ID
 *
 * Public room:
 * - Everyone can access.
 *
 * Private room:
 * - Host can access.
 * - Existing member can access.
 * - Non-member can SEE the room in the list,
 *   but cannot enter without joining first.
 */
const getRoomById = async (
    roomId,
    userId
) => {
    const room =
        await Room.findById(roomId)
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
        throw new Error(
            "Room not found."
        );
    }

    /**
     * Expired rooms are no longer accessible.
     */
    if (isRoomExpired(room)) {
        throw new Error(
            "This room has expired."
        );
    }

    /**
     * PUBLIC ROOM
     *
     * Anyone can access.
     */
    if (!room.isPrivate) {
        return formatRoomResponse(
            room,
            userId
        );
    }

    /**
     * PRIVATE ROOM
     *
     * Host can access.
     */
    const hostId =
        room.host._id.toString();

    const currentUserId =
        userId.toString();

    if (hostId === currentUserId) {
        return formatRoomResponse(
            room,
            userId
        );
    }

    /**
     * PRIVATE ROOM
     *
     * Existing member can access.
     */
    const isMember =
        room.members.some(
            (member) =>
                member._id.toString() ===
                currentUserId
        );

    if (isMember) {
        return formatRoomResponse(
            room,
            userId
        );
    }

    /**
     * PRIVATE ROOM
     *
     * User can see this room in
     * getAllRooms(), but cannot
     * directly enter it.
     */
    throw new Error(
        "You must join this private room first."
    );
};

/**
 * Join Room Using Invite Code
 */
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

    const room =
        await Room.findOne({
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

    /**
     * Expired rooms cannot be joined.
     */
    if (isRoomExpired(room)) {
        throw new Error(
            "This room has expired."
        );
    }

    /**
     * Previously removed users
     * cannot directly rejoin.
     */
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

    /**
     * Already a member.
     */
    const isMember =
        room.members.some(
            (member) =>
                member.toString() ===
                userId.toString()
        );

    if (isMember) {
        throw new Error(
            "You are already a member of this room."
        );
    }

    /**
     * Check room capacity.
     */
    if (
        room.members.length >=
        room.maxMembers
    ) {
        throw new Error(
            "Room is full."
        );
    }

    /**
     * Add member.
     */
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

/**
 * Leave Room
 */
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

    if (isRoomExpired(room)) {
        throw new Error(
            "This room has expired."
        );
    }

    /**
     * Host cannot leave.
     */
    if (
        room.host.toString() ===
        userId.toString()
    ) {
        throw new Error(
            "Host cannot leave the room. Delete the room instead."
        );
    }

    /**
     * Check membership.
     */
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

    /**
     * Remove user from members.
     */
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

/**
 * Delete Room
 */
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

    /**
     * Delete PDF from Cloudinary.
     */
    if (room.pdfPublicId) {
        try {
            await deletePdfFromCloudinary(
                room.pdfPublicId
            );
        } catch (error) {
            console.error(
                "Failed to delete room PDF:",
                error
            );
        }
    }

    await Room.findByIdAndDelete(
        roomId
    );

    return true;
};


/**
 * Automatically expire one room.
 *
 * Used by the backend expiration
 * scheduler.
 */
const expireRoom = async (room) => {
    if (!room) {
        return false;
    }

    /**
     * Check that the room still exists.
     */
    const existingRoom =
        await Room.findById(room._id);

    if (!existingRoom) {
        return false;
    }

    /**
     * Only expire rooms that have
     * actually crossed 24 hours.
     */
    if (!isRoomExpired(existingRoom)) {
        return false;
    }

    /**
     * Save the room ID before deleting it.
     */
    const roomId =
        existingRoom._id.toString();

    /**
     * Delete PDF from Cloudinary.
     *
     * Cloudinary failure should not prevent
     * the expired room from being removed.
     */
    if (existingRoom.pdfPublicId) {
        try {
            await deletePdfFromCloudinary(
                existingRoom.pdfPublicId
            );
        } catch (error) {
            console.error(
                `Failed to delete expired room PDF (${roomId}):`,
                error
            );
        }
    }

    /**
     * Delete the room from MongoDB.
     */
    await Room.findByIdAndDelete(
        existingRoom._id
    );

    /**
     * Notify all connected clients.
     */
    const io = getSocketIO();

    if (io) {
        io.emit(
            "room:deleted",
            {
                roomId,
            }
        );
    }

    console.log(
        `🗑️ Room expired and deleted: ${roomId}`
    );

    return true;
};

/**
 * Find and expire all rooms that
 * have crossed their 24-hour lifetime.
 *
 * This function will be called by
 * the backend scheduler.
 */
const expireExpiredRooms = async () => {
    const expirationDate = new Date(
        Date.now() - ROOM_LIFETIME_MS
    );

    const expiredRooms =
        await Room.find({
            createdAt: {
                $lte: expirationDate,
            },
        });

    let expiredCount = 0;

    for (const room of expiredRooms) {
        try {
            const expired =
                await expireRoom(room);

            if (expired) {
                expiredCount += 1;
            }
        } catch (error) {
            console.error(
                `Failed to expire room ${room._id}:`,
                error
            );
        }
    }

    return expiredCount;
};

/**
 * Update Room
 */
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

    if (isRoomExpired(room)) {
        throw new Error(
            "This room has expired."
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

/**
 * Upload PDF to Cloudinary.
 */
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

    if (isRoomExpired(room)) {
        throw new Error(
            "This room has expired."
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

    const result = await new Promise(
        (resolve, reject) => {
            const stream =
                cloudinary.uploader.upload_stream(
                    {
                        folder: "studysync/pdfs",
                        resource_type: "raw",
                    },
                    (
                        error,
                        result
                    ) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );

            stream.end(file.buffer);
        }
    );

    const oldPdfPublicId =
        room.pdfPublicId;

    room.pdfUrl =
        result.secure_url;

    room.pdfPublicId =
        result.public_id;

    await room.save();

    /**
     * Delete old PDF after
     * new PDF is saved.
     */
    if (oldPdfPublicId) {
        try {
            await deletePdfFromCloudinary(
                oldPdfPublicId
            );
        } catch (error) {
            console.error(
                "Failed to delete old PDF from Cloudinary:",
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

/**
 * Delete PDF from room.
 */
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

    if (isRoomExpired(room)) {
        throw new Error(
            "This room has expired."
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

    const oldPdfPublicId =
        room.pdfPublicId;

    room.pdfUrl = "";
    room.pdfPublicId = "";

    await room.save();

    if (oldPdfPublicId) {
        try {
            await deletePdfFromCloudinary(
                oldPdfPublicId
            );
        } catch (error) {
            console.error(
                "Failed to delete PDF from Cloudinary:",
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

/**
 * Get Room Messages
 */
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

    if (isRoomExpired(room)) {
        throw new Error(
            "This room has expired."
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

/**
 * Request Rejoin
 */
const requestRejoin = async (
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

    if (isRoomExpired(room)) {
        throw new Error(
            "This room has expired."
        );
    }

    const isMember =
        room.members.some(
            (member) =>
                member.toString() ===
                userId.toString()
        );

    if (isMember) {
        throw new Error(
            "You are already a member of this room."
        );
    }

    const removedEntry =
        room.removedMembers?.find(
            (entry) =>
                entry.user.toString() ===
                userId.toString()
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
                request.status ===
                    "pending"
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

/**
 * Approve Rejoin Request
 */
const approveRejoinRequest = async (
    hostId,
    roomId,
    userId
) => {
    const room =
        await Room.findById(roomId);

    if (!room) {
        throw new Error(
            "Room not found."
        );
    }

    if (isRoomExpired(room)) {
        throw new Error(
            "This room has expired."
        );
    }

    if (
        room.host.toString() !==
        hostId.toString()
    ) {
        throw new Error(
            "Only the host can approve rejoin requests."
        );
    }

    const request =
        room.rejoinRequests?.find(
            (item) =>
                item.user.toString() ===
                    userId.toString() &&
                item.status ===
                    "pending"
        );

    if (!request) {
        throw new Error(
            "Rejoin request not found."
        );
    }

    const alreadyMember =
        room.members.some(
            (member) =>
                member.toString() ===
                userId.toString()
        );

    if (!alreadyMember) {
        if (
            room.members.length >=
            room.maxMembers
        ) {
            throw new Error(
                "Room is full."
            );
        }

        room.members.push(userId);
    }

    request.status =
        "approved";

    await room.save();

    await createActivity(
        userId,
        "room_rejoined",
        room._id
    );

    return true;
};

/**
 * Reject Rejoin Request
 */
const rejectRejoinRequest = async (
    hostId,
    roomId,
    userId
) => {
    const room =
        await Room.findById(roomId);

    if (!room) {
        throw new Error(
            "Room not found."
        );
    }

    if (isRoomExpired(room)) {
        throw new Error(
            "This room has expired."
        );
    }

    if (
        room.host.toString() !==
        hostId.toString()
    ) {
        throw new Error(
            "Only the host can reject rejoin requests."
        );
    }

    const request =
        room.rejoinRequests?.find(
            (item) =>
                item.user.toString() ===
                    userId.toString() &&
                item.status ===
                    "pending"
        );

    if (!request) {
        throw new Error(
            "Rejoin request not found."
        );
    }

    request.status =
        "rejected";

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
    expireRoom,
    expireExpiredRooms,
    isRoomExpired,
    getRoomExpirationTime,
    updateRoom,
    uploadRoomPdf,
    deleteRoomPdf,
    getRoomMessages,

    requestRejoin,
    approveRejoinRequest,
    rejectRejoinRequest,
};