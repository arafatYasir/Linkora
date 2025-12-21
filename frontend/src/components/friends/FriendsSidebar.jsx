import { Link, useLocation } from "react-router-dom"
import { friendTypes } from "../../constants/friendTypes"

const FriendsSidebar = () => {
    const { pathname } = useLocation();

    return (
        <aside className="w-full max-w-[360px] min-h-screen min-h-svh bg-surface border-r border-border sticky top-[56px] overflow-y-auto">
            {/* ---- Header ---- */}
            <div className="p-4">
                <h2 className="text-2xl font-bold text-text-primary">Friends</h2>
            </div>

            {/* ---- Friend Types ---- */}
            <nav className="px-2">
                <ul>
                    {
                        friendTypes.map(type => {
                            const isActive = pathname === type.url;
                            return (
                                <li key={type.id}>
                                    <Link
                                        to={type.url}
                                        className={`flex items-center gap-3 p-2 rounded-xl transition-[var(--transition-default)] group ${isActive
                                                ? "bg-bg text-primary"
                                                : "hover:bg-bg text-text-primary"
                                            }`}
                                    >
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isActive
                                                ? "bg-primary text-white"
                                                : "bg-border"
                                            }`}>
                                            <type.icon size={20} />
                                        </div>

                                        <span className="font-bold text-base flex-1">
                                            {type.type}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })
                    }
                </ul>
            </nav>
        </aside>
    )
}

export default FriendsSidebar