const ButtonPair = ({ action, cancel, fontSize = "14px", paddingX = "16px", paddingY = "8px" }) => {
    return (
        <div
            className="flex justify-end gap-x-2 mt-2"
            style={{
                fontSize,
            }}
        >
            <button
                onClick={cancel}
                className="rounded-lg bg-text-primary/20 hover:bg-text-primary/40 cursor-pointer"
                style={{
                    padding: `${paddingY} ${paddingX}`
                }}
            >
                Cancel
            </button>
            <button
                onClick={action}
                className="rounded-lg bg-primary hover:bg-primary-hover cursor-pointer"
                style={{
                    padding: `${paddingY} ${paddingX}`
                }}
            >
                Save
            </button>
        </div>
    )
}

export default ButtonPair