const Post = require("../models/postModel");

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
    
}

module.exports = {createPost, getAllPosts};