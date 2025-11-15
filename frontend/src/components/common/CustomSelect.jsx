import { useState, useRef, useEffect } from "react";
import { FaAngleDown } from "react-icons/fa6";

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
                className={`
                w-full rounded-[var(--radius-button)] border 
                outline-none text-left flex items-center justify-between 
                transition-[var(--transition-default)]
                bg-[var(--color-bg)]
                text-[var(--color-text-secondary)] cursor-pointer
                border-[var(--color-border)]
                ${value ? "text-[var(--color-text-primary)]" : ""}
                ${isOpen ? "border-[var(--color-primary)] shadow-[var(--color-glow-green)]" : ""}
                `}
                style={{
                    padding: `${paddingY} ${paddingX}`
                }}
            >
                <span>{value ? value : placeholder}</span>

                <FaAngleDown
                    className={`
            w-5 h-5 transition-transform duration-200 
            text-[var(--color-text-secondary)]
            ${isOpen ? "rotate-180" : "rotate-0"}
          `}
                />
            </button>

            {/* --- Dropdown Menu --- */}
            {isOpen && (
                <div
                    className={`
            absolute z-50 w-full mt-2 rounded-[var(--radius-button)]
            border border-[var(--color-border)]
            bg-[var(--color-surface)]
            shadow-[var(--shadow-light)]
            max-h-[200px] overflow-y-auto
          `}
                >
                    {options.map((option) => {
                        const active = value === option.value;
                        console.log("--------------");
                        console.log("Is that a match: ", active);
                        console.log("State: ", value);
                        console.log("Map: ", option.value);

                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`
                  w-full px-4 py-2.5 text-left transition-[var(--transition-default)]
                  text-[var(--color-text-primary)]
                  hover:bg-primary/30
                  ${active ? "bg-primary/30" : "hover:bg-primary/20"}
                   cursor-pointer
                `}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
export default CustomSelect;