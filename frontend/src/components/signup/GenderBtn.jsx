const GenderBtn = ({ formData, handleChange, gender }) => {
    return (
        <label className={`flex items-center gap-2 cursor-pointer px-4 py-3 rounded-lg border border-border transition-all bg-bg ${formData.gender === gender ? "text-primary-hover" : "text-text-primary"} hover:border-primary-hover`}>
            <input
                type="radio"
                name="gender"
                id={gender}
                value={gender}
                onChange={handleChange}
                checked={formData.gender === gender}
                className="appearance-none w-4 h-4 rounded-full border-2 cursor-pointer transition-all"
                style={{
                    borderColor: formData.gender === gender ? 'var(--color-primary-hover)' : 'var(--color-border)',
                    backgroundColor: formData.gender === gender ? 'var(--color-primary-hover)' : 'transparent',
                    boxShadow: formData.gender === gender ? 'inset 0 0 0 2px var(--color-surface)' : 'none'
                }}
            />
            <span className={`${formData.gender === gender ? "text-text-primary" : "text-text-secondary"}`}>{gender}</span>
        </label>
    )
}

export default GenderBtn