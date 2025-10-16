const sendVerificationEmail = require("../helpers/mailer");
const jwtToken = require("../helpers/token");
const jwt = require("jsonwebtoken");
const { validateEmail, validateLength, generateValideUsername } = require("../helpers/validation");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const newUser = async (req, res) => {
    try {
        const {
            firstname,
            lastname,
            email,
            password,
            day,
            month,
            year,
            gender
        } = req.body;

        // Checking if the length of firstname or lastname is out of bounds
        if (!validateLength(firstname, 3, 15)) {
            return res.status(400).json({
                error: "Firstname length should be between 3 - 15 characters"
            });
        }

        if (!validateLength(lastname, 3, 15)) {
            return res.status(400).json({
                error: "Lastname length should be between 3 - 15 characters"
            });
        }

        // Checking if the firs letter of both names are capital or not
        if(firstname[0] !== firstname[0].toUpperCase()) {
            return res.status(400).json({
                error: "First letter should be capital"
            });
        }

        if(lastname[0] !== lastname[0].toUpperCase()) {
            return res.status(400).json({
                error: "First letter should be capital"
            });
        }

        // Checking if the email is valid
        if (!validateEmail(email)) {
            return res.status(400).json({
                error: "Invalid Email!"
            });
        }

        // Checking if a user already exists with same email
        const emailExists = await User.findOne({ email });

        if (emailExists) {
            return res.status(400).json({
                error: "The email already exists"
            });
        }

        // Creating a temporary username
        const tempUsername = firstname + lastname;
        const finalUsername = await generateValideUsername(tempUsername);

        // Checking password length
        if (!validateLength(password, 8, 40)) {
            return res.status(400).json({
                error: "Password length can be 8 - 40 characters"
            });
        }

        // Encrypting the password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Creating a new user structure
        const user = new User({
            firstname,
            lastname,
            email,
            username: finalUsername,
            password: encryptedPassword,
            day,
            month,
            year,
            gender
        });

        // Saving the user to database
        await user.save();

        // Creating a verification token
        const verificationToken = jwtToken({id: user._id.toString()}, "15m");
        const verificationURL = `${process.env.BASE_URL}/verify/${verificationToken}`;

        // Sending verification email
        sendVerificationEmail(user.email, verificationURL);

        // Creating a access token
        const token = jwtToken({id: user._id.toString()}, "7d");

        // Sending user data response
        res.send({
            id: user._id,
            username: user.username,
            profilePicture: user.profilePicture,
            firstname: user.firstname,
            lastname: user.lastname,
            verified: user.verified,
            message: "Registration successful! Please verify your email.",
            token,
        });
    } catch (e) {
        console.log(e.message);
        res.status(404).json({ error: "Can't create a user." });
    }
}

const verifyUser = async (req, res) => {
    try {
        const {token} = req.body;
        // Decoding the user info object
        const userInfo = jwt.verify(token, process.env.SECRET);

        // Searching for user with that id
        const isAlreadyVerified = await User.findById(userInfo.id);

        // Checking if the user is already verified
        if(isAlreadyVerified.verified) {
            return res.status(400).json({
                error: "This email is already verified!"
            });
        }

        // If not verified then verify him
        isAlreadyVerified.verified = true;

        // Save to database
        isAlreadyVerified.save();

        // Sending a success response
        res.send({
            message: "Email is verified successfully!"
        });
    }
    catch (e) {
        res.status(404).json({
            error: e.message
        });
    }
}

const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        // Checking if user exists with the email
        const userExists = await User.findOne({email});

        // If user not found
        if(!userExists) {
            res.status(404).json({
                error: "The email doesn't exist"
            });
        }

        // Check if the user is verified
        if(!userExists.verified) {
            return res.status(400).json({
                error: "You are not verified. Please verify your email!"
            });
        }

        // If found then check if the password matches
        const isPasswordMatched = await bcrypt.compare(password, userExists.password);

        if(!isPasswordMatched) {
            return res.status(404).json({
                error: "The password is invalid"
            });
        }

        const token = jwtToken({id: userExists._id.toString()}, "7d");
        
        res.send({
            id: userExists._id,
            username: userExists.username,
            profilePicture: userExists.profilePicture,
            firstname: userExists.firstname,
            lastname: userExists.lastname,
            verified: userExists.verified,
            message: "Login successful",
            token,
        });
    }
    catch (e) {
        res.status(400).json({
            error: e.message
        });
    }
}

module.exports = { newUser, verifyUser, loginUser };