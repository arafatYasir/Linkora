const IntroButton = ({ buttonText, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="w-full py-1.5 bg-border rounded-lg hover:bg-primary/50 cursor-pointer transition-all duration-250"
        >{buttonText}</button>
    )
}

export default IntroButton