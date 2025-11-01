import { useSelector } from "react-redux"
import { postOptions } from "../../constants/postOptions"
import PostOption from "./PostOption";

const PostOptions = ({ user, optionsRef }) => {
    const { userInfo } = useSelector(state => state.auth);

    return (
        <div 
            className="absolute top-10 right-0 w-[300px] px-3 py-4 bg-[var(--color-bg)] rounded-lg shadow-lg border border-[var(--color-border)] flex flex-col gap-y-2"
            ref={optionsRef}
        >
            {
                userInfo.id === user._id ? (
                    postOptions.creator.map(option => (
                        <PostOption key={option.id} option={option} />
                    ))
                ) : (
                    postOptions.visitor.map(option => (
                        <PostOption key={option.id} option={option} />
                    ))
                )
            }
        </div>
    )
}

export default PostOptions