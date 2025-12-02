const Post = require("../models/postModel");

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
        const posts = await Post.find({}).populate("user", "firstname lastname username profilePicture coverPhoto gender").sort({ createdAt: -1 });

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
            };
        })

        res.json(postsWithReaction);
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
        const posts = await Post.find({ user: id }).populate("user", "firstname lastname username profilePicture coverPhoto gender").sort({ createdAt: -1 });

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

        res.json(postsWithReaction);
    } catch (e) {
        res.status(404).json({
            error: e.message
        })
    }
}

const reactPost = async (req, res) => {
    try {
        const { react, postId } = req.body;
        const post = await Post.findById(postId);

        // If post not found
        if (!post) {
            return res.status(404).json({
                error: "Post not found!"
            });
        }

        const hasAlreadyReacted = post.reacts.find(react => react.reactedBy.toString() === req.user.id);

        // If user has not reacted before then create a new react
        if (!hasAlreadyReacted) {
            post.reacts.push({
                react,
                reactedBy: req.user.id
            })

            await post.save();

            console.log("Adding react");
        }
        else {
            // If previous react and new react is same then delete react from post
            if (hasAlreadyReacted.react === react) {
                post.reacts.pull(hasAlreadyReacted._id);

                await post.save();
                console.log("Removing react");
            }
            else {
                // If previous react and new react is not same then update react
                post.reacts.find(react => react.reactedBy.toString() === req.user.id).react = react;
                await post.save();
                console.log("Updating react");
            }
        }

        res.json({
            message: "Reacted successfully",
            status: "OK",
            post
        });
    } catch (e) {
        res.status(404).json({
            error: e.message
        })
    }
}

const commentPost = async (req, res) => {
    try {
        const { comment, image, postId } = req.body;
        const post = await Post.findById(postId);
        
        post.comments.push({
            comment,
            image,
            commentedBy: req.user.id,
            commentedAt: new Date()
        });
        
        await (await post.save()).populate("comments.commentedBy", "firstname lastname profilePicture username");

        res.json({
            message: "Commented successfully",
            status: "OK",
            comments: post.comments
        });
    } catch (e) {
        res.status(404).json({
            error: e.message
        })
    }
}

module.exports = { createPost, getAllPosts, getUserPosts, reactPost, commentPost };