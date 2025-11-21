import FriendsList from "./FriendsList"
import ProfileIntro from "./intro/ProfileIntro"
import ProfilePhotos from "./ProfilePhotos"

const ProfileItemsLeft = ({ user, isImagesLoading, images }) => {

    return (
        <div className="col-span-2 h-full">
            <ProfileIntro user={user} details={user.details} />
            <ProfilePhotos user={user} isImagesLoading={isImagesLoading} images={images} />
            <div className="sticky top-0">
                <FriendsList friends={user?.friends} />
            </div>
        </div>
    )
}

export default ProfileItemsLeft