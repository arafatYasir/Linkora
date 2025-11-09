const { sendVerificationEmail, sendPasswordResetCode } = require("../helpers/mailer");
const jwtToken = require("../helpers/token");
const jwt = require("jsonwebtoken");
const { validateEmail, validateLength, generateValideUsername } = require("../helpers/validation");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const Code = require("../models/code");
const bcrypt = require("bcrypt");
const generateCode = require("../helpers/generateCode");


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
        if (firstname[0] !== firstname[0].toUpperCase()) {
            return res.status(400).json({
                error: "First letter should be capital"
            });
        }

        if (lastname[0] !== lastname[0].toUpperCase()) {
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
            gender,
        });

        // Creating a verification token
        const verificationToken = jwtToken({ id: user._id.toString() }, "15m");
        const verificationTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
        const verificationURL = `${process.env.BASE_URL}/verify/${verificationToken}`;

        user.verificationTokenExpiry = verificationTokenExpiry;

        // Saving the user to database
        await user.save();

        // Sending verification email
        await sendVerificationEmail(user.email, verificationURL);

        // Sending user data response
        res.send({
            message: "Registration successful! Please verify your email.",
        });
    } catch (e) {
        console.log(e.message);
        res.status(404).json({ error: "Can't create a user." });
    }
}

const verifyUser = async (req, res) => {
    try {
        const { token } = req.body;

        // Decoding the user info object
        const userInfo = jwt.verify(token, process.env.SECRET);

        // Searching for user with that id
        const isAlreadyVerified = await User.findById(userInfo.id);

        // Checking if the user is already verified
        if (isAlreadyVerified.verified) {
            return res.status(400).json({
                error: "This email is already verified!"
            });
        }

        // If not verified then verify him
        isAlreadyVerified.verified = true;
        isAlreadyVerified.verificationTokenExpiry = null;

        // Save to database
        isAlreadyVerified.save();

        // Sending a success response
        res.send({
            message: "Email is verified successfully!"
        });
    }
    catch (e) {
        res.status(404).json({
            error: "Token is expired or user not found!"
        });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Checking if user exists with the email
        const userExists = await User.findOne({ email });

        // If user not found
        if (!userExists) {
            res.status(404).json({
                error: "The email doesn't exist"
            });
        }

        // Check if the user is not verified
        if (!userExists.verified) {
            // Check if the user's verification token is expired
            if (userExists.verificationTokenExpiry && userExists.verificationTokenExpiry < new Date()) {
                const reVerificationToken = jwtToken({ id: userExists._id.toString() }, "15m");
                const reVerificationTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
                const reVerificationURL = `${process.env.BASE_URL}/verify/${reVerificationToken}`;

                sendVerificationEmail(userExists.email, reVerificationURL);

                userExists.verificationTokenExpiry = reVerificationTokenExpiry;
                await userExists.save();

                return res.send({
                    message: "You are not verified. Another verification mail is sent to you! Check your mail."
                });
            }
            else {
                return res.status(400).json({
                    error: "You are not verified. Please verify your email!"
                });
            }
        }

        // If found then check if the password matches
        const isPasswordMatched = await bcrypt.compare(password, userExists.password);

        if (!isPasswordMatched) {
            return res.status(404).json({
                error: "The password is invalid"
            });
        }

        // Generating access & refresh token
        const accessToken = jwtToken({ id: userExists._id.toString() }, "15m");
        const refreshToken = jwtToken({ id: userExists._id.toString() }, "365d");

        // Putting tokens on user data
        userExists.accessToken = accessToken;
        userExists.refreshToken = refreshToken;

        await userExists.save();

        // Sending refresh token as cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year validation of refresh token
        });

        res.send({
            message: "Login successful",
            _id: userExists._id,
            email: userExists.email,
            username: userExists.username,
            profilePicture: userExists.profilePicture,
            coverPhoto: userExists.coverPhoto,
            firstname: userExists.firstname,
            lastname: userExists.lastname,
            verified: userExists.verified,
            day: userExists.day,
            month: userExists.month,
            year: userExists.year,
            gender: userExists.gender,
            friends: userExists.friends,
            followers: userExists.followers,
            following: userExists.following,
            friendRequests: userExists.friendRequests,
            details: userExists.details,
            savedPosts: userExists.savedPosts,
            accessToken,
        });
    }
    catch (e) {
        res.status(400).json({
            error: e.message
        });
    }
}

const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;

        if (!token || token.trim() === "") {
            res.status(400).json({
                error: "Token not found!"
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET);
        if (!decoded) {
            res.status(404).json({
                error: "Invalid token!"
            });
        }

        const user = await User.findById(decoded.id);

        if (!user) {
            res.status(404).json({
                error: "No such user exists with this token"
            });
        }

        const newAccessToken = jwtToken({ id: user._id.toString() }, "15m");

        user.accessToken = newAccessToken;
        
        await user.save();

        res.send({
            accessToken: newAccessToken
        });
    } catch (e) {
        console.log(e);
        res.status(400).json({
            error: e.message
        })
    }
}

const findUser = async (req, res) => {
    try {
        const { email } = req.body;
        const userExists = await User.findOne({ email }).select("-password");

        if (!userExists) {
            return res.status(404).json({
                error: "The email is not found!"
            });
        }

        res.send({
            email: userExists.email,
            profilePicture: userExists.profilePicture
        })
    } catch (e) {
        res.status(400).json({
            error: e.message
        });
    }
}

const resetCode = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email }).select("-password");

        await Code.findOneAndDelete({ userId: user._id });

        const code = generateCode(6);

        const newCode = new Code({
            code,
            userId: user._id
        });

        await newCode.save();

        sendPasswordResetCode(user.email, code);

        res.send({
            message: "Password reset code is sent to your mail!"
        });

    } catch (e) {
        res.status(400).json({
            error: e.message
        });
    }
}

const verifyCode = async (req, res) => {
    try {
        const { email, code } = req.body;
        const user = await User.findOne({ email });
        const userCode = await Code.findOne({ userId: user._id });

        if (userCode.code !== code) {
            return res.status(404).json({
                error: "The code is invalid!"
            });
        }

        res.send({
            status: "OK"
        })
    } catch (e) {
        res.status(400).json({
            error: e.message
        });
    }
}

const newPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const encryptedPassword = await bcrypt.hash(password, 10);

        await User.findOneAndUpdate({ email }, { password: encryptedPassword });

        res.send({
            message: "Password reset successful!",
            status: "OK"
        })
    } catch (e) {
        res.status(400).json({
            error: e.message
        });
    }
}

const getUser = async (req, res) => {
    try {
        const {username} = req.params;

        const user = await User.findOne({username}).select("-password -refreshToken -verificationTokenExpiry");

        if(!user) {
            return res.status(404).json({
                status: "Not Found"
            });
        }

        const posts = await Post.find({user: user._id}).sort({createdAt: -1}).populate("user");

        res.json({...user.toObject(), posts});
    } catch (e) {
        res.status(400).json({
            error: e.message
        });
    }
}

const updateProfilePicture = async (req, res) => {
    try {
        const {url} = req.body;
        await User.findByIdAndUpdate(req.user.id, {profilePicture: url});
        
        res.send({
            status: "OK",
            url
        });
    } catch (e) {
        res.status(400).json({
            error: e.message
        });
    }
}

module.exports = { newUser, verifyUser, loginUser, findUser, resetCode, verifyCode, newPassword, refreshToken, getUser, updateProfilePicture };