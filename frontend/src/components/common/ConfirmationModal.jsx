const ConfirmationModal = ({ text, onConfirm, onCancel, loading }) => {
    return (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-surface p-4 rounded-md shadow-lg z-50">
            <p>{text}</p>
            <div className="flex justify-end gap-x-2 mt-2">
                <button
                    onClick={onCancel}
                    className="rounded-lg px-4 py-2 bg-text-primary/20 hover:bg-text-primary/40 cursor-pointer disabled:bg-text-primary/10 disabled:hover:bg-text-primary/10 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="rounded-lg px-4 py-2 bg-primary hover:bg-primary-hover cursor-pointer disabled:bg-primary/50 disabled:hover:bg-primary/50 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? "Confirming..." : "Confirm"}
                </button>
            </div>
        </div>
    )
}

export default ConfirmationModal