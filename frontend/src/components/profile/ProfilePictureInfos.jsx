import { useEffect, useState } from "react";
import { IoIosCamera } from "react-icons/io"
import { useSelector } from "react-redux"
import ChangeProfilePicture from "./ChangeProfilePicture";
import RelationshipButton from "./RelationshipButton";
import { MdPeopleAlt, MdPersonAddAlt1 } from "react-icons/md";
import { FiUserCheck, FiUserX } from "react-icons/fi";
import { FaSquarePlus } from "react-icons/fa6";

const ProfilePictureInfos = ({ user, defaultPhoto, refetchPosts, isImagesLoading, images }) => {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [relationship, setRelationship] = useState({
        friends: false,
        following: false,
        sentRequest: false,
        receivedRequest: false
    })
    const { userInfo } = useSelector(state => state.auth);

    // const sendFriendRequest = async () => {
    //     try {
    //         console.log("ab");
            
    //     } catch (e) {
    //         console.log("Error while sending request: ", e);
    //     }
    // }

    // Locking the scroll when modal is open
    useEffect(() => {
        const body = document.querySelector("body");
        if (showUploadModal) {
            body.style.overflow = "hidden";
        }
        else {
            body.style.overflowY = "scroll";
        }
    }, [showUploadModal]);

    useEffect(() => {
        if (userInfo._id !== user._id) {
            if (userInfo.friends.includes(user._id) && user.friends.includes(userInfo._id)) {
                setRelationship(prev => ({ ...prev, friends: true }));
            }
            else if (userInfo.following.includes(user._id) && user.followers.includes(userInfo._id)) {
                setRelationship(prev => ({ ...prev, following: true }));
            }
            else if (user.friendRequests.includes(userInfo._id)) {
                setRelationship(prev => ({ ...prev, sentRequest: true }));
            }
            else if (userInfo.friendRequests.includes(user._id)) {
                setRelationship(prev => ({ ...prev, receivedRequest: true }));
            }
        }
    }, [user, userInfo]);

    return (
        <div className="flex items-center justify-between gap-x-4 absolute -bottom-28 left-10">
            <div className="relative">
                <div className="w-44 h-44 rounded-full border-4 border-bg overflow-hidden">
                    <img
                        src={user.profilePicture || defaultPhoto}
                        alt={`${user.firstname} ${user.lastname}'s Profile Picture | ${user.username}`}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* ---- Change Profile Picture ---- */}
                {
                    userInfo._id === user._id && (
                        <button
                            className="absolute bottom-5 right-2 bg-border p-1 rounded-full hover:bg-primary transition-all duration-250 cursor-pointer"
                            onClick={() => setShowUploadModal(true)}
                        >
                            <IoIosCamera size={24} />
                        </button>
                    )
                }
                {
                    showUploadModal && <ChangeProfilePicture setShowUploadModal={setShowUploadModal} refetchPosts={refetchPosts} isImagesLoading={isImagesLoading} images={images} />
                }
            </div>

            <div className="flex flex-col gap-y-4 mt-[60px]">
                <p className="text-[32px] font-bold leading-[16px]">{user.firstname} {user.lastname}</p>
                <p className="space-x-1">
                    <span className="text-[15px] font-semibold leading-[16px]">{user.friends.length} Friends</span>
                    <span>•</span>
                    <span className="text-[15px] font-semibold leading-[16px]">{user.followers.length} Followers</span>
                    <span>•</span>
                    <span className="text-[15px] font-semibold leading-[16px]">{user.following.length} Following</span>
                </p>
            </div>

            {/* ---- Action Buttons ---- */}
            {
                <div className="ml-[100px] mt-[60px] flex gap-x-2">
                    {userInfo._id !== user._id && (
                        relationship.friends ? (
                            <RelationshipButton
                                text="Friends"
                                icon={<MdPeopleAlt size={20} />}
                                backgroundColor="var(--color-border)"
                            />
                        ) : relationship.following ? (
                            <RelationshipButton
                                text="Following"
                                icon={<FiUserCheck size={20} />}
                                backgroundColor="var(--color-border)"
                            />
                        ) : relationship.sentRequest ? (
                            <RelationshipButton
                                text="Cancel request"
                                icon={<FiUserX size={20} />}
                            />
                        ) : relationship.receivedRequest ? (
                            <RelationshipButton
                                text="Respond"
                                icon={<FiUserCheck size={20} />}
                            />
                        ) : <></>
                    )}

                    {userInfo._id !== user._id && !relationship.friends && (
                        <RelationshipButton
                            text="Add friend"
                            icon={<MdPersonAddAlt1 size={20} />}
                        />
                    )}

                    {userInfo._id !== user._id && !relationship.following && (
                        <RelationshipButton
                            text="Follow"
                            icon={<FaSquarePlus size={20} />}
                        />
                    )}
                </div>
            }
        </div>
    )
}

export default ProfilePictureInfos