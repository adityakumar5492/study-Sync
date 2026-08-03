const validateRegister = (data) => {
    const { name, email, password } = data;

    if (!name || !email || !password) {
        return "All fields are required.";
    }

    if (name.trim().length < 2) {
        return "Name must be at least 2 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return "Invalid email format.";
    }

    if (password.length < 6) {
        return "Password must be at least 6 characters.";
    }

    return null;
};
const validateLogin = (data) => {
    const { email, password } = data;

    if (!email || !password) {
        return "Email and password are required.";
    }

    return null;
};

module.exports = {
    validateRegister,
    validateLogin,
};