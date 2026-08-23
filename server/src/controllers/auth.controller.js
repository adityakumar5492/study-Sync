const { validateRegister,validateLogin} = require("../validators/auth.validator");
const { registerUser,loginUser} = require("../services/auth.service");
const generateToken = require("../utils/generateToken");
const formatUserResponse = require("../utils/formatUserResponse");

const register = async (req, res) => {
    try {
        const error = validateRegister(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error,
            });
        }

        const user = await registerUser(req.body);

        const token = generateToken(user._id);

        res.cookie("token", token, {
        httpOnly: true,
        secure: true,      // change to true after HTTPS deployment
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
        success: true,
        message: "User registered successfully.",
        user: formatUserResponse(user),
    });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const login = async (req, res) => {
    try {
        const error = validateLogin(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error,
            });
        }

        const user = await loginUser(req.body);

        const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: "Login successful.",
            user: formatUserResponse(user),
        });

    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};

const getCurrentUser = async (req, res) => {
    res.status(200).json({
        success: true,
        user: formatUserResponse(req.user),
    });
};

const logout = (req, res) => {
    res.clearCookie("token");

    res.status(200).json({
        success: true,
        message: "Logged out successfully.",
    });
};

module.exports = {
    register,
    login,
    logout,
    getCurrentUser,

};