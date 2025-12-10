const CustomInput = ({ type, value, setValue, placeholder, paddingX, paddingY, width = "auto", fontSize = "16px", borderWidth = "1px", backgroundColor = "transparent" }) => {
    return (
        <input
            type={type}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            style={{
                padding: `${paddingY} ${paddingX}`,
                width: width,
                fontSize: fontSize,
                transition: "var(--transition-default) border",
                borderWidth: borderWidth,
                background: backgroundColor
            }}
            className="rounded-lg px-3 py-1 border-[var(--color-border)] focus:outline-none focus:border-primary focus:shadow-[var(--color-glow-green)] hover:border-primary-hover"
        />
    )
}

export default CustomInput