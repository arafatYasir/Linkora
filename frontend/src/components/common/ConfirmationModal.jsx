import { IoMdClose } from "react-icons/io";

const ConfirmationModal = ({ heading, text, onConfirm, onCancel, loading }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-xl shadow-lg bg-surface border border-border overflow-hidden transform transition-all">
                {/* ---- Header ---- */}
                <div className="relative flex items-center justify-center py-4 border-b border-border">
                    <h2 className="text-xl font-bold text-text-primary">
                        {heading}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="absolute right-4 p-2 rounded-full cursor-pointer text-text-secondary bg-border/50 hover:bg-border hover:text-text-primary transition-colors active:scale-95"
                        aria-label="Close"
                        disabled={loading}
                    >
                        <IoMdClose size={22} />
                    </button>
                </div>

                {/* ---- Body ---- */}
                <div className="p-4">
                    <p className="text-text-secondary leading-relaxed">
                        {text}
                    </p>
                </div>

                {/* ---- Footer ---- */}
                <div className="flex justify-end gap-x-2 p-4">
                    <button
                        onClick={onCancel}
                        className="rounded-lg px-4 py-2 bg-text-primary/20 hover:bg-text-primary/40 cursor-pointer disabled:bg-text-primary/10 disabled:hover:bg-text-primary/10 disabled:cursor-not-allowed transition-colors"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="rounded-lg px-4 py-2 bg-primary hover:bg-primary-hover cursor-pointer disabled:bg-primary/50 disabled:hover:bg-primary/50 disabled:cursor-not-allowed transition-colors"
                        disabled={loading}
                    >
                        {loading ? "Confirming..." : "Confirm"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationModal