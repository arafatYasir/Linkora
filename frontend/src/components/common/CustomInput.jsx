const CustomInput = ({value, setValue, placeholder, paddingX, paddingY, width = "auto", fontSize = "16px", borderWidth = "1px"}) => {
    return (
        <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            style={{
                padding: `${paddingY} ${paddingX}`,
                width: width,
                fontSize: fontSize,
                transition: "var(--transition-default)",
                borderWidth: borderWidth
            }}
            className="rounded-lg px-3 py-1 border-[var(--color-border)] focus:outline-none focus:border-primary focus:shadow-[var(--color-glow-green)]"
        />
    )
}

export default CustomInput