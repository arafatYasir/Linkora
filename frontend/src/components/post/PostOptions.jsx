import { useSelector } from "react-redux"
import { postOptions } from "../../constants/postOptions"
import PostOption from "./PostOption";

const PostOptions = ({ user, postId, setPosts }) => {
    const { userInfo } = useSelector(state => state.auth);

    return (
        <div 
            className="absolute z-50 top-10 right-0 w-[300px] px-3 py-4 bg-[var(--color-bg)] rounded-lg shadow-lg border border-[var(--color-border)] flex flex-col gap-y-2"
        >
            {
                userInfo._id === user._id ? (
                    postOptions.creator.map(option => (
                        <PostOption key={option.id} option={option} postId={postId} setPosts={setPosts} />
                    ))
                ) : (
                    postOptions.visitor.map(option => (
                        <PostOption key={option.id} option={option} postId={postId} setPosts={setPosts} />
                    ))
                )
            }
        </div>
    )
}

export default PostOptions