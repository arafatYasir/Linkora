import { useEffect, useState } from "react";
import { IoIosCamera } from "react-icons/io"
import { useSelector } from "react-redux"
import ChangeProfilePicture from "./ChangeProfilePicture";
import RelationshipButton from "./RelationshipButton";
import { MdPeopleAlt, MdPersonAddAlt1 } from "react-icons/md";
import { FiUserCheck, FiUserX } from "react-icons/fi";
import { FaSquarePlus } from "react-icons/fa6";
import { useAcceptRequestMutation, useAddFriendMutation, useCancelRequestMutation, useDeleteRequestMutation, useUnfollowMutation, useUnfriendMutation, useFollowMutation } from "../../../api/authApi";

const ProfilePictureInfos = ({ user, defaultPhoto, refetchPosts, isImagesLoading, images }) => {
    // States
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [relationship, setRelationship] = useState(null);

    // Redux states
    const { userInfo } = useSelector(state => state.auth);

    // Add friend request api
    const [addFriend, { isLoading: isRequesting }] = useAddFriendMutation();

    // Cancel friend request api
    const [cancelRequest, { isLoading: isCancelingRequest }] = useCancelRequestMutation();

    // Accept frined request api
    const [acceptRequest, { isLoading: isAcceptingRequest }] = useAcceptRequestMutation();

    // Delete friend request api
    const [deleteRequest, { isLoading: isDeletingRequest }] = useDeleteRequestMutation();

    // Unfriend api
    const [unfriend, { isLoading: isUnfriending }] = useUnfriendMutation();

    // Unfollow api
    const [unfollow, { isLoading: isUnfollowing }] = useUnfollowMutation();

    // Follow api
    const [follow, { isLoading: isFollowing }] = useFollowMutation();

    // Functions to control the relationship actions
    const sendFriendRequest = async () => {
        try {
            const res = await addFriend(user._id).unwrap();
            setRelationship({ ...relationship, following: true, sentRequest: true });
        } catch (e) {
            console.log("Error while sending request: ", e);
        }
    }

    const cancelFriendRequest = async () => {
        try {
            const res = await cancelRequest(user._id).unwrap();
            setRelationship({ ...relationship, following: false, sentRequest: false });
        } catch (e) {
            console.log("Error while canceling request: ", e);
        }
    }

    const acceptFriendRequest = async () => {
        try {
            const res = await acceptRequest(user._id).unwrap();
            setRelationship({ ...relationship, friends: true, following: true, receivedRequest: false });
        } catch (e) {
            console.log("Error while accepting request: ", e);
        }
    }

    const deleteFriendRequest = async () => {
        try {
            const res = await deleteRequest(user._id).unwrap();
            setRelationship({ ...relationship, receivedRequest: false });
        } catch (e) {
            console.log("Error while deleting request: ", e);
        }
    }

    const unFriend = async () => {
        try {
            const res = await unfriend(user._id).unwrap();
            setRelationship({ ...relationship, friends: false, following: false, });
        } catch (e) {
            console.log("Error while unfriending: ", e);
        }
    }

    const unFollow = async () => {
        try {
            const res = await unfollow(user._id).unwrap();
            setRelationship({ ...relationship, following: false, });
        } catch (e) {
            console.log("Error while unfollowing: ", e);
        }
    }

    const followUser = async () => {
        try {
            const res = await follow(user._id).unwrap();
            setRelationship({ ...relationship, following: true, });
        } catch (e) {
            console.log("Error while unfollowing: ", e);
        }
    }
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

    // Storing the relationship status whenever it changes
    useEffect(() => {
        setRelationship(user.relationship);
    }, [user.relationship]);

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
                        relationship?.friends ? (
                            <RelationshipButton
                                text="Friends"
                                icon={<MdPeopleAlt size={20} />}
                                backgroundColor="var(--color-border)"
                                loading={isUnfriending}
                                loadingUI={`${isUnfriending ? "Unfriending..." : "Unfollowing..."}`}
                                extraAction1={unFollow}
                                extraAction2={unFriend}
                            />
                        ) : relationship?.receivedRequest ? (
                            <RelationshipButton
                                text="Respond"
                                icon={<FiUserCheck size={20} />}
                                loading={isAcceptingRequest || isDeletingRequest}
                                loadingUI={`${isAcceptingRequest ? "Accepting..." : "Deleting..."}`}
                                extraAction1={acceptFriendRequest}
                                extraAction2={deleteFriendRequest}
                            />
                        ) : relationship?.sentRequest ? (
                            <RelationshipButton
                                text="Cancel request"
                                icon={<FiUserX size={20} />}
                                onClick={cancelFriendRequest}
                                loading={isCancelingRequest}
                                loadingUI="Canceling..."
                            />
                        ) : (relationship?.following && !relationship.sentRequest) ? (
                            <RelationshipButton
                                text="Following"
                                icon={<FiUserCheck size={20} />}
                                backgroundColor="var(--color-border)"
                            />
                        ) : <></>
                    )}

                    {(userInfo._id !== user._id && !relationship?.friends && !relationship?.sentRequest && !relationship?.receivedRequest) && (
                        <RelationshipButton
                            text="Add friend"
                            loading={isRequesting}
                            loadingUI="Sending request..."
                            icon={<MdPersonAddAlt1 size={20} />}
                            onClick={sendFriendRequest}
                        />
                    )}

                    {(userInfo._id !== user._id && !relationship?.following && !relationship?.receivedRequest && !relationship?.sentRequest) && (
                        <RelationshipButton
                            text="Follow"
                            icon={<FaSquarePlus size={20} />}
                            onClick={followUser}
                            loading={isFollowing}
                            loadingUI="Following..."
                        />
                    )}
                </div>
            }
        </div>
    )
}

export default ProfilePictureInfos