import ProfileIntro from "./intro/ProfileIntro"
import ProfilePhotos from "./ProfilePhotos"

const ProfileItemsLeft = ({user, isImagesLoading, images}) => {

    return (
        <div className="col-span-2 h-full">
            <ProfileIntro user={user} details={user.details} />
            <div className="sticky top-0">
                <ProfilePhotos user={user} isImagesLoading={isImagesLoading} images={images} />
            </div>
        </div>
    )
}

export default ProfileItemsLeft