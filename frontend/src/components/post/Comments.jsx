import { useEffect, useState } from "react";
import Comment from "./Comment";

const Comments = ({ comments }) => {
    const [limit, setLimit] = useState(2);
    const [sortedComments, setSortedComments] = useState([]);

    useEffect(() => {
        if (comments.length > 0) {
            setSortedComments([...comments].sort((a, b) => new Date(b.commentedAt) - new Date(a.commentedAt)));
        }
    }, [comments]);

    return (
        <div className="border-t border-[var(--color-border)] px-4 pt-3 pb-2">
            {sortedComments.length > 0 && sortedComments.slice(0, limit).map((comment, index) => (
                <Comment key={comment._id || index} comment={comment} />
            ))}

            {sortedComments.length > 0 && limit < sortedComments.length && (
                <button
                    onClick={() => setLimit(limit + 3)}
                    className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors duration-200 mt-2 ml-10 cursor-pointer bg-border px-1 py-1.5 rounded-lg"
                >
                    Show more comments
                </button>
            )}

            {
                sortedComments.length > 0 && limit >= sortedComments.length && (
                    <button
                        onClick={() => setLimit(2)}
                        className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors duration-200 mt-2 ml-10 cursor-pointer bg-border px-1 py-1.5 rounded-lg"
                    >
                        Show less comments
                    </button>
                )
            }
        </div>
    );
};

export default Comments;