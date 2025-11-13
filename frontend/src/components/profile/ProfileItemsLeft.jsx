import ProfileIntro from "./intro/ProfileIntro"
import ProfilePhotos from "./ProfilePhotos"

const ProfileItemsLeft = ({user, isImagesLoading, images}) => {

    return (
        <div className="col-span-2">
            <ProfileIntro user={user} details={user.details} />
            <ProfilePhotos user={user} isImagesLoading={isImagesLoading} images={images} />
        </div>
    )
}

export default ProfileItemsLeft