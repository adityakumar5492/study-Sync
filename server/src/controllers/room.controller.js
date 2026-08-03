const {
    createRoom,
    getAllRooms,
    getRoomById,
    joinRoom,
    leaveRoom,
    deleteRoom,
    updateRoom,
    uploadRoomPdf,
} = require("../services/room.service");

const createStudyRoom = async (req, res) => {
    try {
        const room = await createRoom(req.user._id, req.body);

        res.status(201).json({
            success: true,
            message: "Room created successfully.",
            room,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getRooms = async (req, res) => {
    try {
        const rooms = await getAllRooms(req.user._id);

        res.status(200).json({
            success: true,
            rooms,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getRoom = async (req, res) => {
    try {
        const room = await getRoomById(
            req.params.id,
            req.user._id
        );

        res.status(200).json({
            success: true,
            room,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

const joinStudyRoom = async (req, res) => {
    try {
        const room = await joinRoom(
            req.user._id,
            req.body.inviteCode
        );

        res.status(200).json({
            success: true,
            message: "Joined room successfully.",
            room,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const leaveStudyRoom = async (req, res) => {
    try {
        const room = await leaveRoom(
            req.user._id,
            req.params.id
        );

        res.status(200).json({
            success: true,
            message: "Left room successfully.",
            room,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const updateStudyRoom = async (req, res) => {
    try {
        const room = await updateRoom(
            req.user._id,
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Room updated successfully.",
            room,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const uploadStudyMaterial = async (req, res) => {
    try {
        const room = await uploadRoomPdf(
            req.user._id,
            req.params.id,
            req.file
        );

        res.status(200).json({
            success: true,
            message: "Study material uploaded successfully.",
            room,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteStudyRoom = async (req, res) => {
    try {
        await deleteRoom(
            req.user._id,
            req.params.id
        );

        res.status(200).json({
            success: true,
            message: "Room deleted successfully.",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createStudyRoom,
    getRooms,
    getRoom,
    joinStudyRoom,
    leaveStudyRoom,
    updateStudyRoom,
    deleteStudyRoom,
    uploadStudyMaterial,
};