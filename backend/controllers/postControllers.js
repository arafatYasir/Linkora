const Post = require("../models/postModel");
const User = require("../models/userModel");

const createPost = async (req, res) => {
    try {
        const post = await new Post(req.body).save();

        res.json({
            message: "Post created successfully",
            status: "OK",
            post
        })
    } catch (e) {
        res.status(400).json({
            error: e.message
        })
    }
}

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).populate("user", "firstname lastname username profilePicture cover").sort({ createdAt: -1 });

        res.send(posts);
    }
    catch (e) {
        res.status(404).json({
            error: e.message
        })
    }
}

const getUserPosts = async (req, res) => {
    try {
        const { id } = req.params;
        const posts = await Post.find({user: id}).populate("user", "firstname lastname username profilePicture cover").sort({ createdAt: -1 });

        res.send(posts);
    } catch (e) {
        res.status(404).json({
            error: e.message
        })
    }
}

module.exports = { createPost, getAllPosts, getUserPosts };