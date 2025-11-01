const Post = require("../models/postModel");
const User = require("../models/userModel");

const createPost = async (req, res) => {
    try {
        const post = await new Post(req.body).save();

        res.send({
            message: "Post created successfully",
            status: "OK",
            ...post
        })
    } catch (e) {
        res.status(400).json({
            error: e.message
        })
    }
}

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).populate("user", "firstname lastname username profilePicture cover").sort({createdAt: -1});

        res.send(posts);
    }
    catch (e) {
        res.status(404).json({
            error: e.message
        })
    }
}

const getUsersPost = async (req, res) => {
    try {
        const {userId} = req.params;
        const user = await User.findOne({_id: userId});

        if(!user) {
            res.status(404).json({
                error: "No user found with this username"
            });
        }

        const userPosts = await Post.find({user: userId}).populate("user", "firstname lastname username profilePicture cover").sort({createdAt: -1});

        res.send(userPosts);
    } catch (e) {
         res.status(404).json({
            error: e.message
        })  
    }
}

module.exports = {createPost, getAllPosts, getUsersPost};