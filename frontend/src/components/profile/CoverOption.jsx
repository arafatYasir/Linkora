const CoverOption = ({option, setShowCoverOptions, inputFileRef}) => {
    const handleClick = () => {
        setShowCoverOptions(false);
        if(option.name.includes("Upload")) {
            inputFileRef.current.click();
        }
    }
    
    return (
        <button
            onClick={handleClick}
            className="font-semibold flex items-center gap-x-3 hover:bg-primary/50 cursor-pointer p-1.5 rounded-md transition-all duration-250"
        >
            <option.icon size={20} />
            <span>{option.name}</span>
        </button>
    )
}

export default CoverOption