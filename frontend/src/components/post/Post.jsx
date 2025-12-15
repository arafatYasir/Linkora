import { formatDistance } from 'date-fns'
import { useEffect, useState } from "react";
import { useRef } from "react";
import { useReactPostMutation } from "../../../api/authApi";
import RegularPost from "./RegularPost";
import SharedPost from "./SharedPost";

const reactionColors = {
    Like: "#2078F4",
    Love: "#F33E58",
    Haha: "#F7B125",
    Wow: "#F7B125",
    Sad: "#F7B125",
    Angry: "#E9710F"
};

const Post = ({ post }) => {
    // States
    const [showReacts, setShowReacts] = useState(false);
    const [react, setReact] = useState(null);
    const [totalReacts, setTotalReacts] = useState(null);
    const [allReactionCounts, setAllReactionCounts] = useState(null);
    const [isReacting, setIsReacting] = useState(false);

    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [commentFile, setCommentFile] = useState(null);
    const [allComments, setAllComments] = useState([]);
    const [showShareModal, setShowShareModal] = useState(false);

    const [showOptions, setShowOptions] = useState(false);

    // Extra hooks
    const commentRef = useRef(null);
    const timerRef = useRef(null);
    const optionsRef = useRef(null);

    // Extracting data from post
    const { _id, text, type, user, background, comments, images, usersReaction, sharedPost, reactionsCount, totalReactions, shares } = post;

    // Reaction api
    const [reactPost] = useReactPostMutation();

    useEffect(() => {
        if (totalReactions) {
            setTotalReacts(totalReactions);
        }
        if (reactionsCount) {
            setAllReactionCounts(reactionsCount);
        }
    }, [reactionsCount, totalReactions]);

    useEffect(() => {
        if (showComments) commentRef.current.focus();
    }, [showComments]);

    useEffect(() => {
        if (comments.length > 0) setAllComments(comments);
    }, [comments]);

    // useEffect to sync and set the usersReaction to state
    useEffect(() => {
        if (usersReaction?.react) {
            setReact(usersReaction?.react);
        }
    }, [usersReaction?.react]);

    useEffect(() => {
        const handleCloseOptions = (e) => {
            if (optionsRef.current && !optionsRef.current.contains(e.target)) {
                setShowOptions(false);
            }
        }

        document.addEventListener("mousedown", handleCloseOptions);

        return () => {
            document.removeEventListener("mousedown", handleCloseOptions);
        }
    }, []);

    // Controlling body scroll lock/unlock depending on share modal state
    useEffect(() => {
        const body = document.querySelector("body");

        if (showShareModal) {
            body.style.overflow = "hidden";
        } else {
            body.style.overflowY = "auto";
        }
    }, [showShareModal]);

    // Functions
    const handleReact = async (reactType) => {
        if (isReacting) return;

        setIsReacting(true);

        const prevReact = react;
        const prevAllReactionCounts = allReactionCounts;
        const prevTotalReacts = totalReacts;

        // Setting local state values for optimistic ui updates
        setReact(prev => prev === reactType ? null : reactType);
        if (prevReact === reactType) {
            setAllReactionCounts(prev => ({
                ...prev,
                [reactType]: prev[reactType] - 1
            }));
            setTotalReacts(prev => prev - 1);
        }
        else {
            // Handling both add and update reaction. If user is adding a completely new reaction then prevReact will be null and it will be ignored. So in that case it will add 1 to the new reaction. But if the user had some other reaction at first and now he is changing the reaction to something else then the prevReact will hold the key of the previous react and previous react count will be decreased by 1. And as always the new react count will be increase by 1.
            setAllReactionCounts(prev => ({
                ...prev,
                ...(prevReact && { [prevReact]: (prev[prevReact] || 1) - 1 }),
                ...(reactType && { [reactType]: (prev[reactType] || 0) + 1 })
            }));

            // If the user had some previous react and now updating it then the react count doesnt change at all
            if (prevReact === null) setTotalReacts(prev => prev + 1);
        }

        try {
            await reactPost({ react: reactType, postId: _id }).unwrap();
            setShowReacts(false);
        } catch (e) {
            console.error("Error while reacting post", e);
            // Reverting back to previous state
            setReact(prevReact);
            setAllReactionCounts(prevAllReactionCounts);
            setTotalReacts(prevTotalReacts);
        } finally {
            setIsReacting(false);
        }
    }

    const postedTime = formatDistance(post.createdAt, new Date(), { addSuffix: true });

    return (
        type === "shared-post" ? (
            <SharedPost
                // Key Data
                user={user}
                type={type}
                postedTime={postedTime}
                text={text}
                sharedPost={sharedPost}
                _id={_id}

                // Reaction States & Logic
                reactionColors={reactionColors}
                allReactionCounts={allReactionCounts}
                totalReacts={totalReacts}
                showReacts={showReacts}
                setShowReacts={setShowReacts}
                react={react}
                timerRef={timerRef}
                handleReact={handleReact}

                // Options Menu Logic
                optionsRef={optionsRef}
                showOptions={showOptions}
                setShowOptions={setShowOptions}

                // Comments & Sharing Logic
                showComments={showComments}
                setShowComments={setShowComments}
                commentText={commentText}
                setCommentText={setCommentText}
                commentFile={commentFile}
                setCommentFile={setCommentFile}
                allComments={allComments}
                setAllComments={setAllComments}
                commentRef={commentRef}
                showShareModal={showShareModal}
                setShowShareModal={setShowShareModal}
            />
        ) : (
            <RegularPost
                // Key Data
                user={user}
                type={type}
                postedTime={postedTime}
                text={text}
                images={images}
                background={background}
                _id={_id}

                // Reaction States & Logic
                reactionColors={reactionColors}
                allReactionCounts={allReactionCounts}
                totalReacts={totalReacts}
                showReacts={showReacts}
                setShowReacts={setShowReacts}
                react={react}
                shares={shares}
                timerRef={timerRef}
                handleReact={handleReact}

                // Options Menu Logic
                optionsRef={optionsRef}
                showOptions={showOptions}
                setShowOptions={setShowOptions}

                // Comments & Sharing Logic
                showComments={showComments}
                setShowComments={setShowComments}
                commentText={commentText}
                setCommentText={setCommentText}
                commentFile={commentFile}
                setCommentFile={setCommentFile}
                allComments={allComments}
                setAllComments={setAllComments}
                commentRef={commentRef}
                showShareModal={showShareModal}
                setShowShareModal={setShowShareModal}
            />
        )
    );
}

export default Post