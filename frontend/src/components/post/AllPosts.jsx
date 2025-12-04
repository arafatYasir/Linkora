import { useEffect, useState } from "react";
import Post from "./Post";

const AllPosts = ({ posts, setPosts }) => {
    const [sortedPosts, setSortedPosts] = useState([]);

    useEffect(() => {
        setSortedPosts([...posts].sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }));
    }, [posts]);

    return (
        <ul className="space-y-5">
            {sortedPosts.map(post => (
                <Post key={post._id} post={post} setPosts={setPosts} />
            ))}
        </ul>
    )
}

export default AllPosts