const PostOption = ({option}) => {
    return (
        <div className="font-semibold flex items-center gap-x-3 hover:bg-primary/50 cursor-pointer p-1.5 rounded-md transition-all duration-200">
            <option.icon size={20} />
            <span>{option.name}</span>
        </div>
    )
}

export default PostOption