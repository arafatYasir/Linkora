import { NavLink, Link } from "react-router-dom"
import SearchBar from "./search/SearchBar"
import { useSelector } from "react-redux"
import { FaBell } from "react-icons/fa"
import { FaAngleDown } from "react-icons/fa6";
import { CgMenuGridO } from "react-icons/cg"
import { navIcons } from "../constants/navOptions"
import { useEffect, useRef, useState } from "react"
import defaultAvatar from "../../public/default images/avatar.png"
import HomePageProfileDropdown from "./homepage/HomePageProfileDropdown";
import SettingsModal from "./homepage/SettingsModal";

const Navbar = () => {
    // States
    const [showIconName, setShowIconName] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    // Extra hooks
    const dropdownRef = useRef(null);
    const settingsRef = useRef(null);

    // Redux states
    const { userInfo } = useSelector(state => state.auth);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }

            if (settingsRef.current && !settingsRef.current.contains(e.target)) {
                setShowSettings(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);

    useEffect(() => {
        const body = document.querySelector("body");

        if (showSettings) {
            body.style.overflow = "hidden";
        } else {
            body.style.overflowY = "scroll";
        }
    }, [showSettings])

    return (
        <header className="sticky top-0 z-50">
            <nav className="bg-surface shadow-sm h-[56px] px-4 grid grid-cols-12 items-center justify-between border-b border-b-border">
                {/* ---- Left Part ---- */}
                <div className="col-span-3 flex items-center gap-2">
                    <NavLink to="/">
                        <img className="w-[40px] h-[40px]" src="/images/logo.svg" alt="Linkora Logo" />
                    </NavLink>

                    {/* ---- Search Bar ---- */}
                    <SearchBar className="hidden lg:block w-[240px]" searchHistory={userInfo?.search} />

                    {/* ---- Mobile Search Icon Placeholder ---- */}
                    <div className="lg:hidden w-[40px] h-[40px] bg-bg rounded-full flex items-center justify-center text-text-secondary">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                </div>

                {/* ---- Middle Part ---- */}
                <div className="col-span-6 hidden md:flex w-full justify-center max-w-[600px] mx-auto h-full">
                    {navIcons.map((icon, index) => (
                        <NavLink
                            to={icon.path}
                            key={index}
                            className={({ isActive }) => `w-full max-w-[110px] h-full flex items-center justify-center hover:bg-bg transition group relative ${isActive ? 'text-primary border-b-2 border-b-primary' : 'text-text-secondary rounded-lg'} relative`}
                            onMouseEnter={() => {
                                if (showIconName !== icon.name) {
                                    setShowIconName(icon.name);
                                }
                            }}
                            onMouseLeave={() => {
                                setShowIconName(null);
                            }}
                        >
                            <icon.icon size={24} />

                            {showIconName === icon.name && (
                                <span className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 text-sm text-text-secondary px-2 py-1 bg-border rounded-lg">
                                    {icon.name}
                                </span>
                            )}
                        </NavLink>
                    ))}
                </div>

                {/* ---- Right Part ---- */}
                <div className="col-span-3 justify-end flex items-center gap-2 xl:gap-3">
                    <div className="w-[40px] h-[40px] bg-bg rounded-full flex items-center justify-center hover:bg-border cursor-pointer text-text-primary">
                        <CgMenuGridO size={24} />
                    </div>

                    <div className="w-[40px] h-[40px] bg-bg rounded-full flex items-center justify-center hover:bg-border cursor-pointer text-text-primary">
                        <FaBell size={20} />
                    </div>

                    <div
                        ref={dropdownRef}
                        className="relative"
                        onClick={() => setShowDropdown(prev => !prev)}
                    >
                        {/* ---- Profile Picture ---- */}
                        <div className="w-[40px] h-[40px] rounded-full border border-border group active:scale-98 cursor-pointer">
                            <div className="rounded-full overflow-hidden">
                                <img
                                    src={userInfo?.profilePicture || defaultAvatar}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* ---- Down Arrow Button ---- */}
                            <button className="absolute bottom-0 -right-0.5 p-0.5 bg-border rounded-full group-hover:bg-primary cursor-pointer">
                                <FaAngleDown size={12} />
                            </button>
                        </div>

                        {/* ---- Profile Dropdown ---- */}
                        {showDropdown && <HomePageProfileDropdown setShowSettings={setShowSettings} />}
                    </div>
                </div>
            </nav>

            {showSettings && <SettingsModal ref={settingsRef} setShowSettings={setShowSettings} />}
        </header>
    )
}

export default Navbar