import Comment from "./Comment";

const Comments = ({ comments }) => {
    return (
        <div className="border-t border-[var(--color-border)] px-4 pt-3 pb-2">
            {comments.map((comment, index) => (
                <Comment key={comment._id || index} comment={comment} />
            ))}
        </div>
    );
};

export default Comments;