import { useState, useRef, useEffect } from "react"
import SearchIcon from "../icons/SearchIcon";
import { useSearchQuery, useLazySearchQuery } from "../../api/authApi";
import { Link } from "react-router-dom";

const SearchBar = () => {
    // States
    const [text, setText] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    // Extra hooks
    const searchRef = useRef(null);

    // Searching api
    const [search, { data, isLoading }] = useLazySearchQuery();

    // When text changes searching happens
    useEffect(() => {
        if(text.trim() !== "") {
            search(text);
        }
        else {
            setSearchResults([]);
        }
    }, [text]);

    useEffect(() => {
        if(data?.data) {
            setSearchResults(data.data);
        }
    }, [data]);

    console.log(searchResults)

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle ESC key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") setIsFocused(false);
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, []);

    const handleClear = () => {
        setText("");
        setSearchResults([]);
    };

    return (
        <>
            {/* ---- Search container ---- */}
            <div ref={searchRef} className="relative z-50 mb-6 max-w-[280px]">
                {/* ---- Search input ---- */}
                <div className={`
                    relative flex items-center bg-bg rounded-full
                `}>
                    {/* ---- Search icon ---- */}
                    <SearchIcon width={20} height={20} />

                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        placeholder="Search Linkora"
                        className="w-full py-2 pl-12 pr-12 bg-transparent outline-none placeholder:text-gray-400"
                    />

                    {/* ---- Clear button ---- */}
                    {text && (
                        <button
                            onClick={handleClear}
                            className="absolute right-4 p-0.5 rounded-full hover:bg-border transition cursor-pointer"
                        >
                            <svg className="w-4.5 h-4.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* ---- Expanded search results card ---- */}
                {isFocused && (
                    <div className={`
                        absolute top-full mt-2 w-full bg-bg rounded-2xl shadow-2xl
                        border border-border overflow-hidden
                        animate-slideDown
                    `}>
                        {/* ---- Results container with max height ---- */}
                        <div className="max-h-[calc(40vh)] overflow-y-auto custom-scrollbar">
                            {text.trim() === "" ? (
                                // ---- Recent searches or suggestions ----
                                <div className="p-4">
                                    <h3 className="text-[15px] font-semibold mb-3">Recent Searches</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 p-2 hover:bg-primary/10 rounded-lg cursor-pointer transition">
                                            
                                        </div>
                                    </div>
                                </div>
                            ) : searchResults.length > 0 ? (
                                // ---- Search results ----
                                <div className="p-2">
                                    {searchResults.map((result) => (
                                        <Link
                                            key={result._id}
                                            to={`/profile/${result.username}`}
                                            className="flex items-center gap-3 px-3 py-2 hover:bg-primary/10 rounded-lg cursor-pointer transition"
                                        >
                                            <div className="w-10 h-10 overflow-hidden rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                <img 
                                                    src={result.profilePicture} 
                                                    alt={`${result.firstname} ${result.lastname}'s Profile Picture`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <div className="flex-1">
                                                <p className="font-medium">{result.firstname} {result.lastname}</p>
                                                <p className="text-xs capitalize">{result.details.bio.slice(0, 22)}...</p>
                                            </div>

                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                // No results
                                <div className="p-8 text-center">
                                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <p className="font-medium">No results found</p>
                                    <p className="text-[13px] mt-1">Try searching for something else</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default SearchBar