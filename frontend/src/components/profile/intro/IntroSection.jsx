// IntroSection.jsx
import { useState } from "react";

/**
 * Props:
 * - title: display title (e.g., "Job")
 * - fieldKey: key to send back to parent (e.g., "job")
 * - value: current value
 * - placeholder: input placeholder
 * - onSave: async function (fieldKey, value) => Promise
 */
const IntroSection = ({ title, fieldKey, value, placeholder = "", onSave }) => {
    const [editing, setEditing] = useState(false);
    const [input, setInput] = useState(value || "");
    const [loading, setLoading] = useState(false);

    const openEdit = () => {
        setInput(value || "");
        setEditing(true);
    };

    const handleCancel = () => {
        setEditing(false);
        setInput(value || "");
    };

    const handleSave = async () => {
        if (input === (value || "")) {
            setEditing(false);
            return;
        }
        setLoading(true);
        try {
            await onSave(fieldKey, input);
            setEditing(false);
        } catch (e) {
            console.error("Error saving intro section", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-3 border-b border-[var(--color-border)]">
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">{title}</h4>

            {!editing ? (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-[var(--color-text-secondary)]">
                        {value ? <span className="text-[var(--color-text-primary)]">{value}</span> : <span className="text-[var(--color-text-secondary)]">No {title.toLowerCase()} added</span>}
                    </div>

                    <div>
                        <button
                            onClick={openEdit}
                            className="text-sm py-1 px-3 rounded-[var(--radius-button)] bg-border hover:bg-primary/10 transition-[var(--transition-default)]"
                        >
                            {value ? "Edit" : `+ Add ${title.toLowerCase()}`}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="mt-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={placeholder || `Enter ${title.toLowerCase()}`}
                        className="w-full border-2 border-[var(--color-border)] rounded-lg px-3 py-2 focus:outline-primary-hover"
                    />
                    <div className="flex justify-end gap-x-2 mt-2">
                        <button
                            onClick={handleCancel}
                            className="py-2 px-4 rounded-lg text-sm font-medium bg-text-primary/20 hover:bg-text-primary/40 transition-[var(--transition-default)]"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="py-2 px-4 rounded-lg text-sm font-medium bg-primary hover:bg-primary-hover transition-[var(--transition-default)]"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IntroSection;