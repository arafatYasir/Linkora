import { useEffect, useRef, useState } from "react"
import { FiUserMinus, FiUserX } from "react-icons/fi"
import { RiCloseLargeLine } from "react-icons/ri";
import { IoMdCheckmark } from "react-icons/io";

const RelationshipButton = ({ icon, text, onClick, extraAction1, extraAction2, loading = false, loadingUI, paddingX = "16px", paddingY = "8px", backgroundColor = "var(--color-primary-hover)" }) => {
    const [showOptions, setShowOptions] = useState(null);
    const optionsRef = useRef(null);

    const toggleOptions = (name) => {
        if(showOptions === name) {
            setShowOptions(null);
        }
        else {
            setShowOptions(name);
        }
    }

    useEffect(() => {
        const handleCloseOptions = (e) => {
            if (optionsRef.current && !optionsRef.current.contains(e.target)) {
                setShowOptions(null)
            }
        }
        document.addEventListener("mousedown", handleCloseOptions);
    }, []);

    return (
        <div ref={optionsRef} className="relative font-semibold text-text">
            <button
                onClick={
                    text === "Friends" ? () => toggleOptions("Friends") : 
                    text === "Respond" ? () => toggleOptions("Respond") :
                    text === "Following" ? () => toggleOptions("Following") : onClick
                }
                className="flex items-center gap-x-1.5 rounded-[var(--radius-button)] cursor-pointer hover:opacity-80 transition-[var(--transition-default)] active:scale-98"
                style={{
                    padding: `${paddingY} ${paddingX}`,
                    background: backgroundColor
                }}
                disabled={loading}
            >
                {icon}
                <span>{loading ? loadingUI : text}</span>
            </button>

            {/* ---- Friends Options ---- */}
            {
                showOptions === "Friends" && (
                    <ul className="flex flex-col absolute bottom-11 left-0 bg-border px-3 py-2 rounded-lg transition-all w-[200px]">
                        <button
                            onClick={() => { }}
                            className="font-semibold flex items-center gap-x-3 hover:bg-primary/50 cursor-pointer p-1.5 rounded-md transition-all duration-250"
                        >
                            <FiUserMinus size={20} />
                            <span>Unfollow</span>
                        </button>
                        <button
                            onClick={() => { }}
                            className="font-semibold flex items-center gap-x-3 hover:bg-primary/50 cursor-pointer p-1.5 rounded-md transition-all duration-250"
                        >
                            <FiUserX size={20} />
                            <span>Unfriend</span>
                        </button>
                    </ul>
                )
            }

            {/* ---- Request Respond Options ---- */}
            {showOptions === "Respond" && (
                <ul className="flex flex-col absolute bottom-11 left-0 bg-border px-3 py-2 rounded-lg transition-all w-[200px]">
                    <button
                        onClick={() => {
                            extraAction1();
                            setShowOptions(null);
                        }}
                        className="font-semibold flex items-center gap-x-3 hover:bg-primary/50 cursor-pointer p-1.5 rounded-md transition-all duration-250"
                    >
                        <IoMdCheckmark size={20} />
                        <span>Confirm request</span>
                    </button>
                    <button
                        onClick={() => {
                            extraAction2();
                            setShowOptions(null);
                        }}
                        className="font-semibold flex items-center gap-x-3 hover:bg-primary/50 cursor-pointer p-1.5 rounded-md transition-all duration-250"
                    >
                        <RiCloseLargeLine size={18} />
                        <span>Delete request</span>
                    </button>
                </ul>
            )}

            {/* ---- Following Options ---- */}
            {showOptions === "Following" && (
                <ul className="flex flex-col absolute bottom-11 left-0 bg-border px-3 py-2 rounded-lg transition-all w-[200px]">
                    <button
                        onClick={() => { }}
                        className="font-semibold flex items-center gap-x-3 hover:bg-primary/30 cursor-pointer p-1.5 rounded-md transition-all duration-250"
                    >
                        <FiUserMinus size={20} />
                        <span>Unfollow</span>
                    </button>
                </ul>
            )}
        </div>
    )
}

export default RelationshipButton