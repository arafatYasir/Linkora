import Post from "./Post";

const AllPosts = ({posts}) => {
    return (
        <ul className="space-y-5">
            {posts.map(post => (
                <Post key={post._id} post={post} />
            ))}
        </ul>
    )
}

export default AllPosts