const RelationshipButton = ({icon, text, onClick, paddingX = "16px", paddingY = "8px", backgroundColor = "var(--color-primary-hover)"}) => {
    return (
        <button 
            onClick={onClick}
            className="flex items-center gap-x-1.5 rounded-[var(--radius-button)] cursor-pointer hover:opacity-80 transition-[var(--transition-default)]"
            style={{
                padding: `${paddingY} ${paddingX}`,
                background: backgroundColor
            }}
        >
            {icon}
            <span>{text}</span>
        </button>
    )
}

export default RelationshipButton