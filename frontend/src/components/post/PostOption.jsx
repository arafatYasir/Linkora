const PostOption = ({ option, handleClick }) => {

    return (
        <button onClick={() => handleClick(option.name)} className="font-semibold flex items-center gap-x-3 hover:bg-primary/50 cursor-pointer p-2 rounded-md">
            <option.icon size={20} />
            <span>{option.name}</span>
        </button>
    )
}

export default PostOption