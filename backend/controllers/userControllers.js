const { sendVerificationEmail, sendPasswordResetCode } = require("../helpers/mailer");
const jwtToken = require("../helpers/token");
const jwt = require("jsonwebtoken");
const { validateEmail, validateLength, generateValideUsername } = require("../helpers/validation");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const Code = require("../models/code");
const bcrypt = require("bcrypt");
const generateCode = require("../helpers/generateCode");
const publishEmailJob = require("../queues/emailProducer");


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
        await publishEmailJob({
            type: "verification",
            email: user.email,
            url: verificationURL
        });

        // Sending user data response
        res.send({
            message: "Registration successful! Please verify your email.",
        });
    } catch (e) {
        console.log(e);
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

                await publishEmailJob({
                    type: "verification",
                    email: userExists.email,
                    url: reVerificationURL
                });

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

        await publishEmailJob({
            type: "passwordReset",
            email: user.email,
            code: code
        });

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
        const { username } = req.params;
        const mySelf = await User.findById(req.user.id);
        const user = await User.findOne({ username }).select("-password -refreshToken -verificationTokenExpiry").populate("search.user", "firstname lastname username profilePicture");

        const relationship = {
            friends: false,
            following: false,
            sentRequest: false,
            receivedRequest: false
        };

        if (!user) {
            return res.status(404).json({
                status: "Not Found"
            });
        }

        if (mySelf.friends.includes(user._id) && user.friends.includes(mySelf._id)) {
            relationship.friends = true;
        }
        if (mySelf.following.includes(user._id) && user.followers.includes(mySelf._id)) {
            relationship.following = true;
        }
        if (user.friendRequests.includes(mySelf._id)) {
            relationship.sentRequest = true;
        }
        if (mySelf.friendRequests.includes(user._id)) {
            relationship.receivedRequest = true;
        }

        const posts = await Post.find({ user: user._id }).populate("user", "-password -refreshToken -verificationTokenExpiry -accessToken -details -friends -followers -following -verified -updatedAt -createdAt -friendRequests -savedPosts -search -sharedPosts -day -month -year").populate("comments.commentedBy", "firstname lastname profilePicture username").sort({ createdAt: -1 });

        const postsWithReaction = posts.map(post => {
            const reactionsCount = {};

            post.reacts.forEach(react => {
                const key = react.react;
                reactionsCount[key] = (reactionsCount[key] || 0) + 1;
            });

            return {
                ...post.toObject(),
                usersReaction: post.reacts.find(react => react.reactedBy.toString() === req.user.id),
                reactionsCount,
                totalReactions: post.reacts.length
            }
        });

        await user.populate({
            path: "friends",
            select: "-accessToken -refreshToken -details -friends -followers -following -password -verificationTokenExpiry -verified -updatedAt -createdAt -friendRequests -savedPosts -search"
        });

        res.json({ ...user.toObject(), posts: postsWithReaction, relationship });
    } catch (e) {
        res.status(400).json({
            error: e.message
        });
    }
}

const updateProfilePicture = async (req, res) => {
    try {
        const { url } = req.body;
        await User.findByIdAndUpdate(req.user.id, { profilePicture: url });

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

const updateCoverPhoto = async (req, res) => {
    try {
        const { url } = req.body;
        await User.findByIdAndUpdate(req.user.id, { coverPhoto: url });

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

const updateProfileIntro = async (req, res) => {
    try {
        const { intro } = req.body;
        await User.findByIdAndUpdate(req.user.id, { details: intro });

        res.send({
            status: "OK"
        });
    } catch (e) {
        res.status(400).json({
            error: e.message
        });
    }
}

const addFriend = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.id !== id) {
            const requestSender = await User.findById(req.user.id);
            const requestReciever = await User.findById(id);

            if (!requestReciever) {
                res.status(404).json({
                    error: "Friend request reciever account not found!"
                });
            }

            if (!requestReciever.friends.includes(requestSender._id) && !requestReciever.friendRequests.includes(requestSender._id)) {
                await requestReciever.updateOne({
                    $push: { friendRequests: requestSender._id }
                });

                await requestReciever.updateOne({
                    $push: { followers: requestSender._id }
                });

                await requestSender.updateOne({
                    $push: { following: requestReciever._id }
                });

                res.send({ message: "Friend request has been sent!" });
            }
            else {
                return res.send({ error: "You are already friends." });
            }
        }
        else {
            return res.send({ error: "You can't perform this to your account." });
        }
    } catch (e) {
        res.status(404).json({
            error: e.message
        });
    }
}

const cancelRequest = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.id !== id) {
            const requestSender = await User.findById(req.user.id);
            const requestReciever = await User.findById(id);

            if (!requestReciever) {
                res.status(404).json({
                    error: "Cancel reciever account not found!"
                });
            }

            if (!requestReciever.friends.includes(requestSender._id) && requestReciever.friendRequests.includes(requestSender._id)) {
                await requestReciever.updateOne({
                    $pull: { friendRequests: requestSender._id }
                });

                await requestReciever.updateOne({
                    $pull: { followers: requestSender._id }
                });

                await requestSender.updateOne({
                    $pull: { following: requestReciever._id }
                });

                res.send({ message: "Friend request canceled!" });
            }
            else {
                return res.send({ error: "Invalid cancel request" });
            }
        }
        else {
            return res.send({ message: "You can't perform this to your account." });
        }
    } catch (e) {
        res.status(400).json({
            error: e.message
        });
    }
}

const follow = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.id !== id) {
            const sender = await User.findById(req.user.id);
            const receiver = await User.findById(id);

            if (!receiver) {
                res.status(404).json({
                    error: "Cancel reciever account not found!"
                });
            }

            if (!receiver.followers.includes(sender._id) && !sender.following.includes(receiver._id)) {
                await receiver.updateOne({
                    $push: { followers: sender._id }
                });

                await sender.updateOne({
                    $push: { following: receiver._id }
                });

                res.send({ message: "Following successful!" });
            }
            else {
                return res.send({ error: "Already following." });
            }
        }
        else {
            return res.send({ message: "You can't perform this to your account." });
        }
    } catch (e) {
        res.status(400).json({
            error: e.message
        });
    }
}

const unFollow = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.id !== id) {
            const sender = await User.findById(req.user.id);
            const receiver = await User.findById(id);

            if (!receiver) {
                res.status(404).json({
                    error: "Cancel reciever account not found!"
                });
            }

            if (receiver.followers.includes(sender._id) && sender.following.includes(receiver._id)) {
                await receiver.updateOne({
                    $pull: { followers: sender._id }
                });

                await sender.updateOne({
                    $pull: { following: receiver._id }
                });

                res.send({ message: "Unfollow successful!" });
            }
            else {
                return res.send({ error: "Already unfollowing" });
            }
        }
        else {
            return res.send({ message: "You can't perform this to your account." });
        }
    } catch (e) {
        res.status(400).json({
            error: e.message
        });
    }
}

const acceptRequest = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.id !== id) {
            const sender = await User.findById(id);
            const receiver = await User.findById(req.user.id);

            if (receiver.friendRequests.includes(sender._id)) {
                await receiver.updateOne({
                    $push: { friends: sender._id, following: sender._id }
                });

                await receiver.updateOne({
                    $pull: { friendRequests: sender._id }
                });

                await sender.updateOne({
                    $push: { friends: receiver._id, followers: receiver._id }
                });

                res.send({ message: "Friend request accepted!" });
            }
            else {
                return res.send({ error: "No such friend request found!" });
            }
        }
        else {
            return res.send({ message: "You can't perform this to your account." });
        }
    } catch (e) {
        res.status(400).json({
            error: e.message
        });
    }
}

const unFriend = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.id !== id) {
            const sender = await User.findById(req.user.id);
            const receiver = await User.findById(id);

            if (receiver.friends.includes(sender._id) && sender.friends.includes(receiver._id)) {
                await receiver.updateOne({
                    $pull: { friends: sender._id, following: sender._id, followers: sender._id }
                });

                await sender.updateOne({
                    $pull: { friends: receiver._id, following: receiver._id, followers: receiver._id }
                });

                res.send({ message: "Successfully unfriend!" });
            }
            else {
                return res.send({ error: "No such friend found!" });
            }
        }
        else {
            return res.send({ message: "You can't perform this to your account." });
        }
    } catch (e) {
        res.status(400).json({
            error: e.message
        });
    }
}

const deleteRequest = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.id !== id) {
            const sender = await User.findById(id);
            const receiver = await User.findById(req.user.id);

            if (receiver.friendRequests.includes(sender._id)) {
                await receiver.updateOne({
                    $pull: { friendRequests: sender._id, followers: sender._id }
                });

                await sender.updateOne({
                    $pull: { following: receiver._id }
                });

                res.send({ message: "Request deleted!" });
            }
            else {
                return res.send({ error: "No such friend request found!" });
            }
        }
        else {
            return res.send({ message: "You can't perform this to your account." });
        }
    } catch (e) {
        res.status(400).json({
            error: e.message
        });
    }
}

const search = async (req, res) => {
    try {
        const { query } = req.params;

        const users = await User.find({ $text: { $search: query } }).select("firstname lastname username profilePicture details");

        res.json({
            status: "OK",
            data: users
        });
    } catch (e) {
        res.status(400).json({
            error: e.message
        });
    }
}

const addToSearchHistory = async (req, res) => {
    try {
        const { searchedUser } = req.body;

        // Try to update the existing search history
        const updateResult = await User.updateOne(
            {
                _id: req.user.id,
                "search.user": searchedUser
            },
            {
                $set: {
                    "search.$.createdAt": new Date()
                }
            }
        )

        // If document wasn't modified then it means the history doesn't exist
        if (updateResult.modifiedCount === 0) {
            await User.updateOne(
                {
                    _id: req.user.id
                },
                {
                    $push: {
                        search: {
                            user: searchedUser,
                            createdAt: new Date()
                        }
                    }
                }
            );
        }

        res.json({ message: "Search history updated." });
    } catch (e) {
        res.status(400).json({
            error: e.message
        });
    }
}

const removeFromSearchHistory = async (req, res) => {
    try {
        const { id } = req.params;

        await User.findByIdAndUpdate(req.user.id, {
            $pull: {
                search: {
                    _id: id
                }
            }
        });

        res.json({
            message: "Deleted search history.",
            status: "OK"
        });
    } catch (e) {
        res.status(400).json({
            error: e.message
        })
    }
}

module.exports = { newUser, verifyUser, loginUser, findUser, resetCode, verifyCode, newPassword, refreshToken, getUser, updateProfilePicture, updateCoverPhoto, updateProfileIntro, addFriend, acceptRequest, cancelRequest, follow, unFollow, unFriend, deleteRequest, search, addToSearchHistory, removeFromSearchHistory };