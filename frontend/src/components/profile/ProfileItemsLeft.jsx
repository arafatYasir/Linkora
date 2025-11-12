import ProfilePhotos from "./ProfilePhotos"

const ProfileItemsLeft = ({user, isImagesLoading, images}) => {

    return (
        <div className="col-span-2">
            <ProfilePhotos user={user} isImagesLoading={isImagesLoading} images={images} />
        </div>
    )
}

export default ProfileItemsLeft