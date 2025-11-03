import ProfilePhotos from "./ProfilePhotos"

const ProfileItemsLeft = ({user}) => {

    return (
        <div className="col-span-2">
            <ProfilePhotos user={user} />
        </div>
    )
}

export default ProfileItemsLeft