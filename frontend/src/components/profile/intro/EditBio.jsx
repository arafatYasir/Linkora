import { useState } from "react"

const EditBio = ({ bio, onCancel, onSave, loading }) => {
    const [editedText, setEditedText] = useState(bio);
    console.log(editedText);
    return (
        <div>
            <textarea
                placeholder="Describe who you are"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                maxLength={100}
                rows={3}
                className="w-full border-2 text-center px-2.5 py-2 focus:outline-primary-hover border-border rounded-lg resize-none text-[15px]"
            />

            <p className="text-xs text-right">{100 - editedText.length} characters remaining</p>

            <div className="flex justify-end gap-x-1 mt-1">
                <button
                    onClick={onCancel}
                    disabled={loading}
                    className="py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-250 cursor-pointer bg-text-primary/20 hover:bg-text-primary/40 "
                >
                    Cancel
                </button>
                <button
                    onClick={() => onSave("single", {}, "bio", editedText)}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-250 cursor-pointer bg-primary hover:bg-primary-hover"
                >
                    {loading ? "Saving..." : "Save"}
                </button>
            </div>
        </div>
    )
}

export default EditBio