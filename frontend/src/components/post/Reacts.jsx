import { reactions } from "../../constants/reactions"

const Reacts = ({ setShowReacts, timerRef }) => {
    return (
        <div className="flex items-center justify-between w-[280px] bg-[var(--color-bg)] shadow-md rounded-full p-1 border border-[var(--color-border)] absolute top-[-50px] left-0"
            onMouseOver={() => {
                clearTimeout(timerRef.current);
                timerRef.current = setTimeout(() => setShowReacts(true), 200)
            }}
            onMouseLeave={() => {
                timerRef.current = setTimeout(() => setShowReacts(false), 500)
            }}
        >
            {reactions.map((react, index) => (
                <img
                    key={index}
                    src={react.image}
                    alt={react.name}
                    className="w-10 h-10 cursor-pointer hover:scale-120 transition-all duration-150"
                />
            ))}
        </div>
    )
}

export default Reacts