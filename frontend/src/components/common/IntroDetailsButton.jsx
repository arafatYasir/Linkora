const IntroDetailsButton = ({action, condition, option1, option2}) => {
    return (
        <button
            onClick={() => action(true)}
            className="text-sm py-1.5 px-3 rounded-[var(--radius-button)] bg-border hover:bg-primary/30 transition-[var(--transition-default)] cursor-pointer"
        >
            {!condition ? option1 : option2}
        </button>
    )
}

export default IntroDetailsButton