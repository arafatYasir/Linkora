import { useState, useRef, useEffect } from "react"
import SearchIcon from "../../icons/SearchIcon";
import { useLazySearchQuery, useAddToSearchHistoryMutation, useRemoveSearchHistoryMutation } from "../../../api/authApi";
import SearchItem from "./SearchItem";
import { IoMdClose } from "react-icons/io";

const SearchBar = ({ searchHistory, className = "max-w-[280px]" }) => {
    // States
    const [text, setText] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);

    // Extra hooks
    const searchRef = useRef(null);

    // Searching api
    const [search, { data: result }] = useLazySearchQuery();

    // Adding to search history api
    const [addToSearchHistory] = useAddToSearchHistoryMutation();

    // Remove from search history api
    const [removeSearchHistory] = useRemoveSearchHistoryMutation();

    // When text changes searching happens
    useEffect(() => {
        if (text.trim() !== "") {
            search(text);
        }
        else {
            setSearchResults([]);
        }
    }, [text]);

    // When search result changes update the state
    useEffect(() => {
        if (result?.data?.length > 0) {
            setSearchResults(result.data);
        }
    }, [result]);

    // When search history changes update the state
    useEffect(() => {
        if (searchHistory?.length > 0) {
            setRecentSearches([...searchHistory].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        }
    }, [searchHistory]);

    // Click outside to close the search bar card
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle ESC key to close the search bar card
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") setIsFocused(false);
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, []);

    // Clear the search bar
    const handleClear = () => {
        setText("");
        setSearchResults([]);
    };

    // Add to search history
    const handleAddToSearchHistory = async (id) => {
        try {
            const res = await addToSearchHistory(id);
        } catch (e) {
            console.log("ERROR while adding to search history:", e);
        }
    }

    // Remove from search history
    const removeFromSearchHistory = async (id) => {
        const prev = recentSearches;

        try {
            setRecentSearches(prev => prev.filter(i => i._id !== id));
            await removeSearchHistory(id);
        } catch (e) {
            console.log("ERROR while removing from search history:", e);

            setRecentSearches(prev);
        }
    }

    return (
        <>
            {/* ---- Search container ---- */}
            <div ref={searchRef} className={`relative z-50 ${className}`}>
                {/* ---- Search input ---- */}
                <div className={`
                    relative flex items-center bg-bg rounded-full h-10
                `}>
                    {/* ---- Search icon ---- */}
                    <SearchIcon className="absolute left-4" width={20} height={20} />

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
                            className="absolute right-3 p-1.5 rounded-full hover:bg-border transition cursor-pointer"
                        >
                            <IoMdClose />
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
                        {/* ---- Results container ---- */}
                        <div className="max-h-[calc(50vh)] overflow-y-auto custom-scrollbar">
                            {text.trim() === "" ? (
                                // ---- Recent searches or suggestions ----
                                <div className="p-3">
                                    <h3 className="text-[15px] font-semibold mb-3 px-2">Recent Searches</h3>
                                    <div className="space-y-2">
                                        {recentSearches?.map(({ user, _id }) => (
                                            <SearchItem
                                                key={_id}
                                                user={user}
                                                add={handleAddToSearchHistory}
                                                remove={() => removeFromSearchHistory(_id)}
                                                type="recent"
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : searchResults.length > 0 ? (
                                // ---- Search results ----
                                <div className="p-3">
                                    {searchResults.map((result) => (
                                        <SearchItem
                                            key={result._id}
                                            user={result}
                                            add={handleAddToSearchHistory}
                                            type="result"
                                        />
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