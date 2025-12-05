const SearchIcon = ({width, height}) => {
    return (
        <svg
            width={width}
            height={height}
            className="absolute left-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
        </svg>
    )
}

export default SearchIcon