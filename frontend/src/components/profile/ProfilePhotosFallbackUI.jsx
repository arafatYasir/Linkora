const ProfilePhotosFallbackUI = () => {
    // Show 6 placeholders as the fallback
    const placeholders = Array.from({ length: 6 });

    return (
        <div className="flex flex-wrap justify-between gap-y-2.5 mt-2">
            {placeholders.map((_, index) => (
                <div
                    key={index}
                    className="w-[120px] h-[120px] rounded-[12px] bg-[var(--color-border)] relative overflow-hidden"
                >
                    <div className="absolute inset-0 shimmer" />
                </div>
            ))}
        </div>
    );
}

export default ProfilePhotosFallbackUI