import Post from "./Post";

const AllPosts = ({posts}) => {
    return (
        <div className="mt-10 space-y-5">
            {posts.map(post => (
                <Post key={post._id} post={post} />
            ))}
        </div>
    )
}

export default AllPosts