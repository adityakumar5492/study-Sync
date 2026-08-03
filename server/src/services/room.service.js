const crypto = require("crypto");
const Room = require("../models/room.model");

const generateInviteCode = () => {
    return crypto.randomBytes(4).toString("hex").toUpperCase();
};

/**
 * Helper: Format room response based on user role
 * - Host: gets full room data including inviteCode
 * - Member: gets room data WITHOUT inviteCode
 */
const formatRoomResponse = (room, userId) => {
    const roomObj = room.toObject();
    
    const isHost = roomObj.host._id 
        ? roomObj.host._id.toString() === userId.toString()
        : roomObj.host.toString() === userId.toString();

    // If user is NOT the host, remove inviteCode
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
        const roomExists = await Room.findOne({ inviteCode });
        if (!roomExists) break;
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

    const populatedRoom = await Room.findById(room._id)
        .populate("host", "name email avatar")
        .populate("members", "name email avatar");

    // Host created it, return full data including inviteCode
    return formatRoomResponse(populatedRoom, userId);
};

/**
 * Get all active rooms.
 * NOTE: Private rooms are intentionally included so non-members can
 * see them and trigger the "Join with invite code" flow.
 * The inviteCode is NEVER sent in the list view — it is only revealed
 * after a successful join (and only to the host).
 */
const getAllRooms = async (userId) => {
    const rooms = await Room.find({
        isActive: true,
    })
        .populate("host", "name email avatar")
        .select("-__v -inviteCode") // ✅ NEVER send inviteCode in list view
        .sort({ createdAt: -1 });

    return rooms;
};

const getRoomById = async (roomId, userId) => {
    const room = await Room.findById(roomId)
        .populate("host", "name email avatar")
        .populate("members", "name email avatar");

    if (!room) {
        throw new Error("Room not found.");
    }

    // Public room → everyone can access
    if (!room.isPrivate) {
        // Still format response - non-hosts don't need inviteCode even for public rooms
        return formatRoomResponse(room, userId);
    }

    // Host can access
    const isHost = room.host._id.toString() === userId.toString();
    if (isHost) {
        return formatRoomResponse(room, userId); // Host gets inviteCode
    }

    // Existing member can access
    const isMember = room.members.some(
        (member) => member._id.toString() === userId.toString()
    );

    if (!isMember) {
        throw new Error("You must join this room first.");
    }

    // Member gets room WITHOUT inviteCode
    return formatRoomResponse(room, userId);
};

const joinRoom = async (userId, inviteCode) => {
    // Defensive guard: never call .toUpperCase() on a missing value
    if (!inviteCode || typeof inviteCode !== "string" || !inviteCode.trim()) {
        throw new Error("Invite code is required.");
    }

    const room = await Room.findOne({
        inviteCode: inviteCode.trim().toUpperCase(),
        isActive: true,
    });

    if (!room) {
        throw new Error("Invalid invite code.");
    }

    const isMember = room.members.some(
        (member) => member.toString() === userId.toString()
    );

    if (isMember) {
        throw new Error("You are already a member of this room.");
    }

    if (room.members.length >= room.maxMembers) {
        throw new Error("Room is full.");
    }

    room.members.push(userId);
    await room.save();

    const populatedRoom = await Room.findById(room._id)
        .populate("host", "name email avatar")
        .populate("members", "name email avatar");

    // ✅ Member just joined - they should NOT see inviteCode
    return formatRoomResponse(populatedRoom, userId);
};

const leaveRoom = async (userId, roomId) => {
    const room = await Room.findById(roomId);

    if (!room) {
        throw new Error("Room not found.");
    }

    if (room.host.toString() === userId.toString()) {
        throw new Error("Host cannot leave the room. Delete the room instead.");
    }

    const isMember = room.members.some(
        (member) => member.toString() === userId.toString()
    );

    if (!isMember) {
        throw new Error("You are not a member of this room.");
    }

    room.members = room.members.filter(
        (member) => member.toString() !== userId.toString()
    );

    await room.save();

    const populatedRoom = await Room.findById(room._id)
        .populate("host", "name email avatar")
        .populate("members", "name email avatar");

    return formatRoomResponse(populatedRoom, userId);
};

const deleteRoom = async (userId, roomId) => {
    const room = await Room.findById(roomId);

    if (!room) {
        throw new Error("Room not found.");
    }

    if (room.host.toString() !== userId.toString()) {
        throw new Error("Only the host can delete this room.");
    }

    await Room.findByIdAndDelete(roomId);

    return true;
};

const updateRoom = async (userId, roomId, data) => {
    const room = await Room.findById(roomId);

    if (!room) {
        throw new Error("Room not found.");
    }

    if (room.host.toString() !== userId.toString()) {
        throw new Error("Only the host can update this room.");
    }

    const {
        name,
        description,
        isPrivate,
        maxMembers,
    } = data;

    if (name !== undefined) room.name = name;
    if (description !== undefined) room.description = description;
    if (isPrivate !== undefined) room.isPrivate = isPrivate;
    if (maxMembers !== undefined) room.maxMembers = maxMembers;

    await room.save();

    const populatedRoom = await Room.findById(room._id)
        .populate("host", "name email avatar")
        .populate("members", "name email avatar");

    // Host is updating - return full data
    return formatRoomResponse(populatedRoom, userId);
};

const uploadRoomPdf = async (userId, roomId, file) => {
    const room = await Room.findById(roomId);

    if (!room) {
        throw new Error("Room not found.");
    }

    // Only host can upload PDF
    if (room.host.toString() !== userId.toString()) {
        throw new Error("Only the host can upload study material.");
    }

    if (!file) {
        throw new Error("PDF file is required.");
    }

    room.pdfUrl = `/uploads/pdfs/${file.filename}`;
    await room.save();

    const populatedRoom = await Room.findById(room._id)
        .populate("host", "name email avatar")
        .populate("members", "name email avatar");

    // Host is uploading - return full data
    return formatRoomResponse(populatedRoom, userId);
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
};

