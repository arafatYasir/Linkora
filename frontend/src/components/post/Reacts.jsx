import { reactions } from "../../constants/reactions"

const Reacts = ({ setShowReacts, timerRef, handleReact }) => {
    return (
        <div className={`grid grid-cols-12 w-[280px] bg-[var(--color-bg)] shadow-md rounded-full p-1 border border-[var(--color-border)] transition-[var(--transition-default)] absolute left-0 top-[-50px]`}
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
                    className="col-span-2 cursor-pointer hover:scale-150 transition-[var(--transition-default)]"
                    onClick={() => handleReact(react.name)}
                />
            ))}
        </div>
    )
}

export default Reacts