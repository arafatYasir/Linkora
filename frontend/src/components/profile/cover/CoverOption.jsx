const CoverOption = ({ option, setShowCoverOptions, setShowChooseModal, inputFileRef }) => {
    const handleClick = () => {
        setShowCoverOptions(false);

        if (option.name.includes("Upload")) {
            inputFileRef.current.click();
        }
        else if (option.name.includes("Choose")) {
            setShowChooseModal(true);
        }
    }

    return (
        <button
            onClick={handleClick}
            className="font-semibold flex items-center gap-x-3 hover:bg-primary/50 cursor-pointer p-2 rounded-md transition-all duration-250"
        >
            <option.icon size={20} />
            <span>{option.name}</span>
        </button>
    )
}

export default CoverOption