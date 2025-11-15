import { useState } from "react";
import IntroDetailsButton from "../../common/IntroDetailsButton";
import CustomInput from "../../common/CustomInput";
import ButtonPair from "../../common/ButtonPair";
import { HiPencil } from "react-icons/hi2";

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
        try {
            setLoading(true);
            await onSave("single", {}, fieldKey, input);
            setEditing(false);
        } catch (e) {
            console.error("Error saving intro section: ", e);
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
                        <IntroDetailsButton action={openEdit} condition={value} option1={`+ Add ${title.toLowerCase()}`} option2={(
                            <span className="flex items-center gap-x-1"><HiPencil size={12} className="opacity-80" /> Edit {title.toLowerCase()}</span>
                        )} />
                    </div>
                </div>
            ) : (
                <div className="mt-2">
                    <CustomInput
                        value={input}
                        setValue={setInput}
                        placeholder={placeholder || `Enter ${title.toLowerCase()}`}
                        width="100%"
                        borderWidth="2px"
                    />

                    <ButtonPair action={handleSave} cancel={handleCancel} loading={loading} paddingX="16px" paddingY="8px" />
                </div>
            )}
        </div>
    );
};

export default IntroSection;