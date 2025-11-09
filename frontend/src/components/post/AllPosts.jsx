import Post from "./Post";

const AllPosts = ({posts}) => {
    const sortedPosts = [...posts].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return (
        <ul className="space-y-5">
            {sortedPosts.map(post => (
                <Post key={post._id} post={post} />
            ))}
        </ul>
    )
}

export default AllPosts