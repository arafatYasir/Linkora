const User = require("../models/userModel");

const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const validateEmail = (email) => {
    return String(email).toLowerCase().match(emailRegex);
}

const validateLength = (text, min, max) => {
    if (text.length < min || text.length > max) {
        return false;
    }

    return true;
}

const generateValideUsername = async (username) => {
    let generate = false;

    do {
        const usernameExists = await User.findOne({ username });

        if (usernameExists) {
            generate = true;
            username += (new Date().getTime()).toString();
        }
        else {
            generate = false;
        }

    } while (generate);

    return username;
}

module.exports = { validateEmail, validateLength, generateValideUsername }