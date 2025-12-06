import { NavLink, Link } from "react-router-dom"
import SearchBar from "./search/SearchBar"
import { useSelector } from "react-redux"
import { FaFacebookMessenger, FaBell } from "react-icons/fa"
import { CgMenuGridO } from "react-icons/cg"
import { navIcons } from "../constants/navOptions"

const Navbar = () => {
    const { userInfo } = useSelector(state => state.auth);

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
                            className={({ isActive }) => `w-full max-w-[110px] h-full flex items-center justify-center hover:bg-bg transition group relative ${isActive ? 'text-primary border-b-2 border-b-primary' : 'text-text-secondary rounded-lg'}`}
                        >
                            <icon.icon size={24} />
                        </NavLink>
                    ))}
                </div>

                {/* ---- Right Part ---- */}
                <div className="col-span-3 justify-end flex items-center gap-2 xl:gap-3">
                    <div className="w-[40px] h-[40px] bg-bg rounded-full flex items-center justify-center hover:bg-border transition cursor-pointer text-text-primary">
                        <CgMenuGridO size={24} />
                    </div>
                    <div className="w-[40px] h-[40px] bg-bg rounded-full flex items-center justify-center hover:bg-border transition cursor-pointer text-text-primary">
                        <FaFacebookMessenger size={20} />
                    </div>
                    <div className="w-[40px] h-[40px] bg-bg rounded-full flex items-center justify-center hover:bg-border transition cursor-pointer text-text-primary">
                        <FaBell size={20} />
                    </div>

                    <Link to="/profile" className="flex items-center gap-2">
                        <div className="w-[40px] h-[40px] rounded-full overflow-hidden border border-border">
                            <img
                                src={userInfo?.profilePicture || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </Link>
                </div>
            </nav>
        </header>
    )
}

export default Navbar