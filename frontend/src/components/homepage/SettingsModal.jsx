import { forwardRef } from "react";
import { IoMdClose, IoMdMoon, IoMdSunny } from "react-icons/io";
import { FaUserCircle, FaLock, FaShieldAlt } from "react-icons/fa";
import { MdLanguage, MdNotifications, MdHelp } from "react-icons/md";
import { BiChevronRight } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { setTheme } from "../../slices/authSlice";
import { useSelector } from "react-redux";

// Setting Items Configuration
const accountSettings = [
    { icon: FaUserCircle, label: "Personal Details", color: "text-blue-500" },
    { icon: FaLock, label: "Password and Security", color: "text-green-500" },
    { icon: FaShieldAlt, label: "Privacy and Data", color: "text-purple-500" }
];

const appSettings = [
    { icon: MdNotifications, label: "Notifications", color: "text-red-500" },
    { icon: MdLanguage, label: "Language and Media", color: "text-orange-500" },
    { icon: MdHelp, label: "Help and Support", color: "text-cyan-500" }
];

const SettingsModal = forwardRef((props, ref) => {
    const { setShowSettings } = props;

    // Extra hooks
    const dispatch = useDispatch();

    // Redux states
    const { theme } = useSelector(state => state.auth);

    // Functions
    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";

        // Update localStorage
        localStorage.setItem("theme", newTheme);

        // Update Redux
        dispatch(setTheme(newTheme));
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-hidden">
            <div
                ref={ref}
                className="w-full max-w-xl max-h-[85vh] rounded-2xl shadow-2xl bg-surface border border-border flex flex-col overflow-hidden"
            >
                {/* ---- Header ---- */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-text-primary">Settings</h2>
                    <button
                        onClick={() => setShowSettings(false)}
                        className="p-2 rounded-full cursor-pointer text-text-secondary bg-border/50 hover:bg-border hover:text-text-primary active:scale-95"
                        aria-label="Close"
                    >
                        <IoMdClose size={22} />
                    </button>
                </div>

                {/* ---- Body ---- */}
                <div className="overflow-y-auto custom-scrollbar p-6 space-y-8">
                    {/* ---- Display & Accessibility ---- */}
                    <div>
                        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">Display & Accessibility</h3>

                        <div className="bg-bg/50 rounded-xl border border-border overflow-hidden">
                            <div className="flex items-center justify-between p-4 hover:bg-border/30 transition">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-text-primary">
                                        <IoMdMoon size={20} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-text-primary">Dark Mode</p>
                                        <p className="text-xs text-text-secondary">Adjust the appearance of Linkora</p>
                                    </div>
                                </div>

                                {/* ---- Toggle Switch ---- */}
                                <div
                                    onClick={toggleTheme}
                                    className="w-11 h-6 bg-border rounded-full relative cursor-pointer"
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-text-secondary rounded-full transition-all ${theme === "dark" ? "translate-x-6" : "translate-x-1"}`}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ---- Account ---- */}
                    <div>
                        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">Account</h3>
                        <div className="bg-bg/50 rounded-xl border border-border overflow-hidden divide-y divide-border">
                            {accountSettings.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-4 hover:bg-border/30 transition cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center ${item.color}`}>
                                            <item.icon size={20} />
                                        </div>
                                        <p className="font-medium text-text-primary group-hover:text-primary transition-colors">{item.label}</p>
                                    </div>
                                    <BiChevronRight size={24} className="text-text-secondary group-hover:text-primary transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ---- Preferences ---- */}
                    <div>
                        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">Preferences</h3>
                        <div className="bg-bg/50 rounded-xl border border-border overflow-hidden divide-y divide-border">
                            {appSettings.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-4 hover:bg-border/30 transition cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center ${item.color}`}>
                                            <item.icon size={20} />
                                        </div>
                                        <p className="font-medium text-text-primary group-hover:text-primary transition-colors">{item.label}</p>
                                    </div>
                                    <BiChevronRight size={24} className="text-text-secondary group-hover:text-primary transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

SettingsModal.displayName = "SettingsModal";

export default SettingsModal;