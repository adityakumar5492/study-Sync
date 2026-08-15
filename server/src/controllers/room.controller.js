const {
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
} = require("../services/room.service");

const {
    getSocketIO,
} = require("../services/activity.service");

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

        const io = getSocketIO();

        if (io) {
            io.emit("room:deleted", {
                roomId: req.params.id,
                message:
                    "A study room was deleted.",
            });
        }

        res.status(200).json({
            success: true,
            message:
                "Room deleted successfully.",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteStudyMaterial = async (req, res) => {
    try {
        const room = await deleteRoomPdf(
            req.user._id,
            req.params.id
        );

        res.status(200).json({
            success: true,
            message: "Study material deleted successfully.",
            room,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getMessages = async (req, res) => {
    try {
        const messages = await getRoomMessages(
            req.user._id,
            req.params.id
        );

        res.status(200).json({
            success: true,
            messages,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const requestRoomRejoin = async (req, res) => {
    try {
        await requestRejoin(
            req.user._id,
            req.params.id
        );

        res.status(200).json({
            success: true,
            message:
                "Rejoin request sent to the host.",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


const approveRoomRejoin = async (req, res) => {
    try {
        await approveRejoinRequest(
            req.user._id,
            req.params.id,
            req.body.userId
        );

        res.status(200).json({
            success: true,
            message:
                "Rejoin request approved.",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


const rejectRoomRejoin = async (req, res) => {
    try {
        await rejectRejoinRequest(
            req.user._id,
            req.params.id,
            req.body.userId
        );

        res.status(200).json({
            success: true,
            message:
                "Rejoin request rejected.",
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
    deleteStudyMaterial,
    getMessages,
    requestRoomRejoin,
    approveRoomRejoin,
    rejectRoomRejoin,
};