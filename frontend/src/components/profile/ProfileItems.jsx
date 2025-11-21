import ProfileItemsLeft from "./ProfileItemsLeft"
import ProfileItemsRight from "./ProfileItemsRight"

const ProfileItems = ({user, isImagesLoading, images}) => {
    return (
        <div className="grid grid-cols-5 gap-x-6 mt-[160px] items-start justify-between px-4">
            <ProfileItemsLeft user={user} isImagesLoading={isImagesLoading} images={images}  />
            <ProfileItemsRight user={user} />
        </div>
    )
}

export default ProfileItems