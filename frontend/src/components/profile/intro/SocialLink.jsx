const SocialLink = ({ icon, username, baseURL }) => {
    return (
        <>
            {
                baseURL ? (
                    <p className="flex items-center gap-x-3">
                        {icon}
                        <a href={`${baseURL}/${username}`} target="_blank" className="text-[15px]">{username}</a>
                    </p>
                ) : (
                    <p className="flex items-center gap-x-3">
                        {icon}
                        <span className="text-[15px]">{username}</span>
                    </p>
                )
            }
        </>
    )
}

export default SocialLink