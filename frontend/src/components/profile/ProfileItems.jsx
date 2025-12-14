import ProfileItemsLeft from "./ProfileItemsLeft"
import ProfileItemsRight from "./ProfileItemsRight"

const ProfileItems = ({ user, posts, isImagesLoading, images }) => {

    return (
        <div className="grid grid-cols-5 gap-x-5 mt-[160px] items-start justify-between px-4">
            <ProfileItemsLeft user={user} isImagesLoading={isImagesLoading} images={images} />
            <ProfileItemsRight user={user} posts={posts} />
        </div>
    )
}

export default ProfileItems