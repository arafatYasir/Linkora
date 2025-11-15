import { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import IntroSection from "./IntroSection";
import CustomInput from "../../common/CustomInput";
import { HiPencil } from "react-icons/hi2";
import CustomSelect from "../../common/CustomSelect"
import ButtonPair from "../../common/ButtonPair";
import IntroDetailsbutton from "../../common/IntroDetailsButton";

const EditDetailsModal = ({ initialDetails = {}, onClose, onSave }) => {
    const introModalRef = useRef(null);
    const [local, setLocal] = useState({ ...initialDetails });
    const [loadingField, setLoadingField] = useState(null);

    useEffect(() => {
        const handleClose = (e) => {
            if (introModalRef.current && !introModalRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClose);
        return () => document.removeEventListener("mousedown", handleClose);
    }, [onClose]);

    useEffect(() => {
        setLocal({ ...initialDetails });
    }, [initialDetails]);

    const saveField = async (type, object, key, value) => {
        setLoadingField(key);
        const previous = local[key];

        try {
            await onSave(type, object, key, value);
        } catch (e) {
            // revert on error
            setLocal((p) => ({ ...p, [key]: previous }));
            console.error("Error saving field", key, e);
            throw e;
        } finally {
            setLoadingField(null);
        }
    };

    // Pronouns editor
    const PronounsEditor = () => {
        const [showSelect, setShowSelect] = useState(false);
        const [pronoun, setPronoun] = useState(local.pronoun || "");
        const [loading, setLoading] = useState(false);

        const pronouns = [
            {
                label: "he/him",
                value: "he/him"
            },
            {
                label: "she/her",
                value: "she/her"
            },
            {
                label: "they/them",
                value: "they/them",
            }
        ];

        const handleAddPronoun = async () => {
            try {
                setLoading(true);
                if (!pronoun) return;
                await saveField("single", {}, "pronoun", pronoun);
                setShowSelect(false);
            } catch (e) {
                console.log("Error while adding a pronoun: ", e);
            } finally {
                setLoading(false);
            }
        };

        const handleCancel = () => {
            setPronoun(initialDetails.pronoun);
            setShowSelect(false);
        }

        const removePronoun = async () => {
            await saveField("single", {}, "pronoun", "");
        };

        return (
            <div className="py-3 border-b border-[var(--color-border)]">
                <h4 className="text-sm font-semibold mb-2">Pronoun</h4>

                <div className="flex items-center gap-2 flex-wrap">
                    {pronoun ? (
                        <div className="px-3 py-1 rounded-full bg-border text-sm flex items-center gap-x-2">
                            <span>{pronoun}</span>
                            <button aria-label="remove" onClick={removePronoun} className="text-lg hover:text-primary opacity-80 hover:opacity-100 cursor-pointer">×</button>
                        </div>
                    ) : (
                        <div className="text-sm text-[var(--color-text-secondary)]">No pronoun is set</div>
                    )}
                </div>

                {!showSelect ? (
                    <div className="mt-3">
                        <IntroDetailsbutton
                            action={setShowSelect}
                            condition={pronoun}
                            option1={"+ Select pronoun"}
                            option2={<span className="flex items-center gap-x-1"><HiPencil size={12} className="opacity-80" /> Edit pronoun</span>}
                        />
                    </div>
                ) : (
                    <div className="mt-2">
                        <CustomSelect
                            placeholder="Select"
                            value={pronoun}
                            onChange={setPronoun}
                            options={pronouns}
                            paddingX="16px"
                            paddingY="8px"
                        />

                        <ButtonPair
                            action={handleAddPronoun}
                            cancel={handleCancel}
                            loading={loading}
                        />
                    </div>
                )}
            </div>
        );
    };

    // Job & Workplace paired editor - small composite
    const JobWorkEditor = () => {
        const [editing, setEditing] = useState(false);
        const [jobValue, setJobValue] = useState(local.job || "");
        const [workValue, setWorkValue] = useState(local.workPlace || "");
        const [loading, setLoading] = useState(false);

        const openEdit = () => {
            setJobValue(local.job || "");
            setWorkValue(local.workPlace || "");
            setEditing(true);
        };

        const handleCancel = () => {
            setEditing(false);
        };

        const handleSave = async () => {
            try {
                setLoading(true);
                
                if(jobValue.trim() !== "" && workValue.trim() === "") {
                    alert("Please enter your workplace name");
                    setLoading(false);
                    return;
                }
                else if(jobValue.trim() === "" && workValue.trim() !== "") {
                    alert("Please the job name");
                    setLoading(false);
                    return;
                }

                const object = { job: jobValue, workPlace: workValue };
                await saveField("multiple", object, "", "");
                setEditing(false);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        return (
            <div className="py-3 border-b border-[var(--color-border)]">
                <h4 className="text-sm font-semibold mb-2">Work & Job</h4>
                {!editing ? (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-[var(--color-text-secondary)]">
                            {local.job || local.workPlace ? (
                                <span className="text-[var(--color-text-primary)]">
                                    {local.job ? `${local.job}` : ""} {local.workPlace ? (local.job ? " at " : "") + local.workPlace : ""}
                                </span>
                            ) : (
                                <span>No workplace or job added</span>
                            )}
                        </div>
                        <div>
                            <IntroDetailsbutton action={openEdit} condition={(jobValue && workValue)} option1={"+ Add workplace"} option2={<span className="flex items-center gap-x-1"><HiPencil size={12} className="opacity-80" /> Edit workplace</span>} />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <CustomInput
                            value={jobValue}
                            setValue={setJobValue}
                            placeholder="Job title (e.g., Product Designer)"
                            width="100%"
                            borderWidth="2px"
                        />

                        <CustomInput
                            value={workValue}
                            setValue={setWorkValue}
                            placeholder="Workplace (e.g., Acme Inc.)"
                            width="100%"
                            borderWidth="2px"
                        />

                        <ButtonPair
                            action={handleSave}
                            cancel={handleCancel}
                            loading={loading}
                        />
                    </div>
                )}
            </div>
        );
    };

    // Social links editor
    const SocialLinksEditor = () => {
        // supported platforms
        const platforms = [
            { key: "github", label: "GitHub", placeholder: "github.com/username" },
            { key: "facebook", label: "Facebook", placeholder: "facebook.com/username" },
            { key: "instagram", label: "Instagram", placeholder: "instagram.com/username" },
            { key: "youtube", label: "YouTube", placeholder: "youtube.com/channel/..." },
            { key: "gmail", label: "Gmail", placeholder: "your@email.com" },
            { key: "x", label: "X (Twitter)", placeholder: "x.com/username" },
        ];

        const [openAdd, setOpenAdd] = useState(false);
        const [selected, setSelected] = useState(platforms[0].key);
        const [value, setValue] = useState("");
        const links = {
            github: local.github,
            facebook: local.facebook,
            instagram: local.instagram,
            youtube: local.youtube,
            gmail: local.gmail,
            x: local.x,
        };

        const addOrUpdate = async () => {
            if (!value.trim()) return;
            await saveField(selected, value.trim());
            setValue("");
            setOpenAdd(false);
        };

        const remove = async (key) => {
            await saveField(key, "");
        };

        return (
            <div className="py-3 border-b border-[var(--color-border)]">
                <h4 className="text-sm font-semibold mb-2">Social links</h4>

                <div className="space-y-2">
                    {platforms.map((p) => (
                        <div key={p.key} className="flex items-center justify-between">
                            <div className="text-sm">
                                <strong className="mr-2">{p.label}:</strong>
                                <span className="text-[var(--color-text-secondary)]">{local[p.key] || <em className="text-[var(--color-text-secondary)]">Not added</em>}</span>
                            </div>
                            <div className="flex gap-x-2">
                                {local[p.key] && (
                                    <button onClick={() => remove(p.key)} className="py-1 px-3 rounded-[var(--radius-button)] bg-text-primary/10 hover:bg-text-primary/20">Remove</button>
                                )}
                                <button onClick={() => { setSelected(p.key); setValue(local[p.key] || ""); setOpenAdd(true); }} className="py-1 px-3 rounded-[var(--radius-button)] bg-border hover:bg-primary/10">
                                    {local[p.key] ? "Edit" : "+ Add"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {openAdd && (
                    <div className="mt-3">
                        <select value={selected} onChange={(e) => setSelected(e.target.value)} className="border-2 border-[var(--color-border)] rounded-lg px-3 py-2 mb-2">
                            {platforms.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
                        </select>
                        <input value={value} onChange={(e) => setValue(e.target.value)} placeholder={platforms.find(p => p.key === selected)?.placeholder || "Enter link"} className="w-full border-2 border-[var(--color-border)] rounded-lg px-3 py-2 focus:outline-primary-hover" />
                        <div className="flex justify-end gap-x-2 mt-2">
                            <button onClick={() => setOpenAdd(false)} className="py-2 px-4 rounded-lg bg-text-primary/20 hover:bg-text-primary/40">Cancel</button>
                            <button onClick={addOrUpdate} className="py-2 px-4 rounded-lg bg-primary hover:bg-primary-hover">Save</button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Relationship editor (dropdown)
    const RelationshipEditor = () => {
        const options = ["Single", "In a Relationship", "It's Complicated", "Engaged", "Married", "Divorced"];
        const [editing, setEditing] = useState(false);
        const [value, setValue] = useState(local.relationShip || options[0]);

        const save = async () => {
            await saveField("relationShip", value);
            setEditing(false);
        };

        return (
            <div className="py-3 border-b border-[var(--color-border)]">
                <h4 className="text-sm font-semibold mb-2">Relationship</h4>
                {!editing ? (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-[var(--color-text-secondary)]">{local.relationShip || "Not specified"}</div>
                        <div>
                            <button onClick={() => setEditing(true)} className="py-1 px-3 rounded-[var(--radius-button)] bg-border hover:bg-primary/10">Edit</button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <select className="w-full border-2 border-[var(--color-border)] rounded-lg px-3 py-2" value={value} onChange={(e) => setValue(e.target.value)}>
                            {options.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                        <div className="flex justify-end gap-x-2 mt-2">
                            <button onClick={() => setEditing(false)} className="py-2 px-4 rounded-lg bg-text-primary/20 hover:bg-text-primary/40">Cancel</button>
                            <button onClick={save} className="py-2 px-4 rounded-lg bg-primary hover:bg-primary-hover">Save</button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div ref={introModalRef} className="w-full max-w-2xl rounded-xl shadow-lg overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] py-4">
                {/* ---- Header ---- */}
                <div className="flex items-center justify-between px-6 pb-4 border-b border-[var(--color-border)]">
                    <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Edit details</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full transition-all duration-250 cursor-pointer text-[var(--color-text-secondary)] bg-border hover:bg-primary/50"
                        aria-label="Close"
                    >
                        <IoMdClose size={20} />
                    </button>
                </div>

                {/* ---- Body ---- */}
                <div className="px-6 max-h-[70vh] overflow-y-auto">
                    {/* ---- Bio View ---- */}
                    <div className="py-3 border-b border-[var(--color-border)]">
                        <h4 className="text-sm font-semibold mb-2">Bio</h4>
                        <div className="text-sm text-[var(--color-text-secondary)]">{local.bio || <em>No bio set</em>}</div>
                    </div>

                    {/* Pronouns */}
                    <PronounsEditor />

                    {/* Job & Workplace */}
                    <JobWorkEditor />

                    {/* Single-field sections using IntroSection component */}
                    <IntroSection title="School" fieldKey="school" value={local.school} onSave={saveField} placeholder="e.g., City High School" />
                    <IntroSection title="College" fieldKey="college" value={local.college} onSave={saveField} placeholder="e.g., Community College" />
                    <IntroSection title="University" fieldKey="university" value={local.university} onSave={saveField} placeholder="e.g., MIT" />

                    {/* City fields */}
                    <IntroSection title="Current city" fieldKey="currentCity" value={local.currentCity} onSave={saveField} placeholder="e.g., London" />
                    <IntroSection title="Hometown" fieldKey="homeTown" value={local.homeTown} onSave={saveField} placeholder="e.g., Dhaka" />

                    {/* Relationship */}
                    <RelationshipEditor />

                    {/* Social Links */}
                    <SocialLinksEditor />

                    <div className="py-6" />
                </div>

                {/* Footer (optional short help) */}
                <div className="px-6 pt-2 pb-4 border-t border-[var(--color-border)] text-sm text-[var(--color-text-secondary)]">
                    <div>Changes are saved per-section. Close the modal when you're done.</div>
                </div>
            </div>
        </div>
    );
};

export default EditDetailsModal;
