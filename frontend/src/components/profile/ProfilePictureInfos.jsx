const ProfilePictureInfos = ({data, defaultPhoto}) => {
    return (
        <div className="flex items-end gap-x-4 absolute -bottom-28 left-10">
            <div className="w-44 h-44 rounded-full border-4 border-bg overflow-hidden">
                <img 
                    src={data.profilePicture || defaultPhoto} 
                    alt={`${data.firstname} ${data.lastname}'s Profile Picture | ${data.username}`}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex flex-col gap-y-4 mb-5">
                <span className="text-[32px] font-bold leading-[16px]">{data.firstname} {data.lastname}</span>
                <span className="text-[15px] font-semibold leading-[16px]">{data.friends.length} Friends</span>
            </div>
        </div>
    )
}

export default ProfilePictureInfos