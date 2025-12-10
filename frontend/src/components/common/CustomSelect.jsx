import { useState, useRef, useEffect } from "react";
import { TfiAngleDown } from "react-icons/tfi";

const CustomSelect = ({ value, onChange, options, placeholder, paddingX, paddingY }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* --- Trigger Button --- */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full rounded-[var(--radius-button)] border outline-none text-left flex items-center justify-between bg-bg text-text-primary cursor-pointer border-[var(--color-border)] ${value ? "text-text-primary" : ""} ${isOpen ? "border-primary-hover shadow-[var(--color-glow-green)]" : ""} hover:border-primary-hover`}
                style={{
                    padding: `${paddingY} ${paddingX}`,
                    transition: "var(--transition-default) border"
                }}
            >
                <span>{value ? value : placeholder}</span>

                <TfiAngleDown
                    className={`transition-transform duration-200 text-[var(--color-text-secondary)] ${isOpen ? "rotate-180" : "rotate-0"}`}
                    size={14}
                />
            </button>

            {/* --- Dropdown Menu --- */}
            {isOpen && (
                <div
                    className={`absolute z-50 w-full mt-2 rounded-[var(--radius-button)] border border-border bg-surface shadow-[var(--shadow-light)] max-h-[200px] overflow-y-auto custom-scrollbar`}
                >
                    {options.map((option, index) => {
                        const active = value === option;

                        return (
                            <button
                                key={index}
                                type="button"
                                onClick={() => {
                                    onChange(option);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-4 py-2.5 text-left transition-[var(--transition-default)] text-text-primary hover:bg-primary/30 ${active ? "border border-primary rounded-lg hover:bg-transparent" : "hover:bg-primary/20"} cursor-pointer`}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
export default CustomSelect;