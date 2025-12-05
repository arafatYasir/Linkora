import { useState, useRef, useEffect } from "react"
import SearchIcon from "../icons/SearchIcon";

const SearchBar = () => {
    const [text, setText] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const searchRef = useRef(null);

    // Mock data - replace with your actual search logic
    const mockResults = [
        { id: 1, name: "John Doe", type: "user" },
        { id: 2, name: "Jane Smith", type: "user" },
        { id: 3, name: "React Tutorial", type: "post" },
        { id: 4, name: "JavaScript Tips", type: "post" },
        { id: 5, name: "JavaScript Tips", type: "post" },
        { id: 6, name: "JavaScript Tips", type: "post" },
        { id: 7, name: "JavaScript Tips", type: "post" },
        { id: 8, name: "JavaScript Tips", type: "post" },
        { id: 9, name: "JavaScript Tips", type: "post" },
        { id: 10, name: "JavaScript Tips", type: "post" },
    ];

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

    // Filter results based on search text
    useEffect(() => {
        if (text.trim()) {
            const filtered = mockResults.filter(item =>
                item.name.toLowerCase().includes(text.toLowerCase())
            );
            setSearchResults(filtered);
        } else {
            setSearchResults([]);
        }
    }, [text]);

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
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                JD
                                            </div>
                                            <div>
                                                <p className="font-medium">John Doe</p>
                                                <p className="text-xs">User</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : searchResults.length > 0 ? (
                                // ---- Search results ----
                                <div className="p-2">
                                    {searchResults.map((result) => (
                                        <div
                                            key={result.id}
                                            className="flex items-center gap-3 p-3 hover:bg-primary/10 rounded-lg cursor-pointer transition"
                                        >
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                {result.name.charAt(0)}
                                            </div>

                                            <div className="flex-1">
                                                <p className="font-medium">{result.name}</p>
                                                <p className="text-xs capitalize">{result.type}</p>
                                            </div>
                                            
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
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