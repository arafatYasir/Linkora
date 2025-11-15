import { useState, useRef, useEffect } from "react";
import { FaAngleDown } from "react-icons/fa6";

const CustomSelect = ({ value, onChange, options, placeholder }) => {
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

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                w-full px-4 py-3 flex items-center justify-between text-left rounded-lg border transition-all duration-200
                ${isOpen ? "border-primary shadow-[0_0_0_3px_rgba(52,178,123,0.2)] text-text-primary" : "border-border text-text-secondary"}bg-bg `}
            >
                <span className={value ? "text-text-primary" : "text-text-secondary"}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <FaAngleDown
                    className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"
                        } text-text-secondary`}
                />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 rounded-lg border max-h-52 overflow-y-auto bg-surface border-border shadow-light">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`
                w-full px-4 py-2.5 text-left transition-colors duration-150
                ${value === option.value
                                    ? "bg-green-100 text-text-primary"
                                    : "bg-transparent text-text-primary hover:bg-green-50"
                                }
              `}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
export defaul CustomSelect;