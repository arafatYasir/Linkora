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
        // First find all the posts of the user
        const userPosts = await Post.find({ user: req.user.id }).populate("user", "firstname lastname username profilePicture gender").populate("comments.commentedBy", "firstname lastname profilePicture username").populate({
            path: "sharedPost",
            populate: {
                path: "user",
                select: "firstname lastname username profilePicture gender"
            }
        });

        // Find the peoples he is following to and get all the posts of those people
        const userFollowing = await User.findById(req.user.id).select("following");
        const followingPosts = await Post.find({ user: { $in: userFollowing.following } }).populate("user", "firstname lastname username profilePicture gender").populate("comments.commentedBy", "firstname lastname profilePicture username").populate({
            path: "sharedPost",
            populate: {
                path: "user",
                select: "firstname lastname username profilePicture gender"
            }
        });

        // Merge his own posts and his following peoples posts
        const posts = [...userPosts, ...followingPosts];

        // Sort the posts by createdAt in ascending order
        posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Add users reaction and reactions count to each post
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
        const posts = await Post.find({ user: id }).populate("user", "firstname lastname username profilePicture gender").populate("comments.commentedBy", "firstname lastname profilePicture username").sort({ createdAt: -1 });

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
        }
        else {
            // If previous react and new react is same then delete react from post
            if (hasAlreadyReacted.react === react) {
                post.reacts.pull(hasAlreadyReacted._id);

                await post.save();
            }
            else {
                // If previous react and new react is not same then update react
                post.reacts.find(react => react.reactedBy.toString() === req.user.id).react = react;
                await post.save();
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

const savePost = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.user.id);

        const isAlreadySaved = user.savedPosts.find(item => item.post.toString() === id);

        if (isAlreadySaved) {
            return res.status(400).json({
                error: "Post already saved!"
            });
        }

        user.savedPosts.push({
            post: id,
            savedAt: new Date()
        });
        await user.save();

        res.json({
            message: "Post saved successfully",
            status: "OK",
            savedPosts: user.savedPosts
        });
    } catch (e) {
        res.status(404).json({
            error: e.message
        })
    }
}

const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                error: "Post not found!"
            });
        }

        // If the post is a shared post then delete the original one from user "sharedPosts" and also decreament the count of shares on the original post
        if (post.type === "shared-post") {
            await User.findByIdAndUpdate(req.user.id, {
                $pull: {
                    sharedPosts: {
                        post: post.sharedPost._id
                    }
                }
            });

            await Post.findByIdAndUpdate(post.sharedPost._id, {
                $pull: {
                    shares: {
                        sharedBy: req.user.id
                    }
                }
            });
        }

        // Then finally delete the post from main database
        await Post.findByIdAndDelete(id);

        res.json({
            message: "Post deleted successfully",
            status: "OK"
        });
    } catch (e) {
        res.status(404).json({
            error: e.message
        })
    }
}

const sharePost = async (req, res) => {
    try {
        const { postId, caption } = req.body;
        const post = await Post.findById(postId).populate("user", "firstname lastname profilePicture username gender");

        if (!post) {
            return res.status(404).json({
                error: "Post not found!"
            });
        }

        // If post is available then add the post to users shared posts
        await User.findByIdAndUpdate(req.user.id, {
            $push: {
                sharedPosts: {
                    post,
                    caption,
                    sharedAt: new Date()
                }
            }
        });

        // Add the user to the post shares array and save the post
        post.shares.push({
            sharedBy: req.user.id,
            sharedAt: new Date()
        });

        await post.save();

        res.json({
            message: "Post shared successfully",
            status: "OK",
            sharedPost: post
        });

    } catch (e) {
        res.status(404).json({
            error: "Something went wrong!"
        });
        console.log(e);
    }
}

module.exports = { createPost, getAllPosts, getUserPosts, reactPost, commentPost, savePost, deletePost, sharePost };