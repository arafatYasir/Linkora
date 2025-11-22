import { useState } from "react";

const AddBio = ({ onCancel, onSave, loading }) => {
    const [bioText, setBioText] = useState("");
    console.log(bioText);
    return (
        <div>
            <textarea
                placeholder="Describe who you are"
                value={bioText}
                onChange={(e) => setBioText(e.target.value)}
                maxLength={100}
                rows={3}
                className="w-full border-2 text-center px-2.5 py-2 rounded-lg resize-none text-[15px] border-[var(--color-border)] focus:outline-none focus:border-primary focus:shadow-[var(--color-glow-green)]"
            />

            <p className="text-xs text-right">{100 - bioText.length} characters remaining</p>

            <div className="flex justify-end gap-x-1 mt-1">
                <button
                    onClick={onCancel}
                    disabled={loading}
                    className="py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-250 cursor-pointer bg-text-primary/20 hover:bg-text-primary/40 disabled:cursor-default disabled:bg-text-primary/50 disabled:hover:bg-text-primary/50"
                >
                    Cancel
                </button>
                <button
                    onClick={async () => await onSave("single", {}, "bio", bioText)}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-250 cursor-pointer bg-primary hover:bg-primary-hover disabled:cursor-default disabled:bg-primary/50 disabled:hover:bg-primary/50"
                >
                    {loading ? "Saving..." : "Save"}
                </button>
            </div>
        </div>
    );
};

export default AddBio;
