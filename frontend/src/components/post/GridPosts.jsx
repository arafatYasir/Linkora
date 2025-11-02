import GridPost from "./GridPost"

const GridPosts = ({ posts }) => {
    return (
        <ul className="grid grid-cols-2 gap-4">
            {posts.map(post => (
                <GridPost key={post._id} post={post} />
            ))}
        </ul>
    )
}

export default GridPosts