import { useDispatch, useSelector } from "react-redux";
import Bio from "./Bio";
import IntroButton from "./IntroButton";
import { useEffect, useState } from "react";
import Relation from "./Relation";
import AddBio from "./AddBio";
import EditBio from "./EditBio";
import { useUpdateProfileIntroMutation } from "../../../../api/authApi";
import { setIntro } from "../../../slices/authSlice";

const ProfileIntro = ({ user, details }) => {
    // States
    const [introInfos, setIntroInfos] = useState({
        bio: details.bio,
        college: details.college,
        university: details.university,
        school: details.school,
        relationShip: details.relationShip,
        currentCity: details.currentCity,
        job: details.job,
        workPlace: details.workPlace,
        homeTown: details.homeTown,
        pronouns: details.pronouns,
        gmail: details.gmail,
        facebook: details.facebook,
        instagram: details.instagram,
        x: details.x,
        youtube: details.youtube,
        github: details.github
    });
    const [isIntroEmpty, setIsIntroEmpty] = useState(true);
    const [addBio, setAddBio] = useState(false);
    const [editBio, setEditBio] = useState(false);
    const [loading, setLoading] = useState(false);

    // Intro saving api
    const [updateProfileIntro] = useUpdateProfileIntroMutation();

    // Redux states
    const { userInfo } = useSelector(state => state.auth);

    // Extra hooks
    const dispatch = useDispatch();

    // useEffect to check if intro is empty
    useEffect(() => {
        const values = Object.values(details);

        values.forEach(value => {
            if (value?.length > 0 || value !== "") {
                setIsIntroEmpty(false);
                return;
            }
        });
    }, [details]);

    // Functions
    const handleCancelBioAdding = () => {
        setAddBio(false);
    }

    const handleCancelBioEditing = () => {
        setEditBio(false);
    }

    const saveIntroInLocal = (intro) => {
        // Saving in local state
        setIntroInfos(intro);

        // Saving in Redux
        dispatch(setIntro(intro));

        // Saing in localstorage
        const user = JSON.parse(localStorage.getItem("userInfo"));
        user.details = intro;

        localStorage.setItem("userInfo", JSON.stringify(user));
    }

    const handleSaveIntro = async (key, value) => {
        try {
            setLoading(true);

            // Saving in local state
            saveIntroInLocal({...introInfos, [key]: value });

            // Saving in database
            const updateResponse = await updateProfileIntro({...introInfos, [key]: value }).unwrap();

            if (updateResponse?.status === "OK") {
                // Reset states
                if (addBio) setAddBio(false);
                else if (editBio) setEditBio(false);
            }
        } catch (e) {
            console.log("Error while saving bio: ", e);
        } finally {
            setLoading(false);
        }
    }

    if (isIntroEmpty) return;

    return (
        <div className="w-full max-w-[640px] bg-[var(--color-surface)] p-4 rounded-[var(--radius-card)] shadow-[var(--shadow-dark)] border border-[var(--color-border)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.6)] transition-[var(--transition-default)] mb-5">
            {/* ---- Header ---- */}
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold leading-6">Intro</h3>
            </div>

            {/* ---- Body ---- */}
            <div>
                {/* ---- Introduction ---- */}
                <div className="mt-4 space-y-3">
                    {(introInfos.bio && !addBio && !editBio) && <Bio text={introInfos.bio} />}
                    {introInfos.relationShip && <Relation relationType={introInfos.relationShip} />}
                </div>

                {/* ---- Intro Editing Section ---- */}
                {user._id === userInfo._id && (
                    <div className="space-y-4 mt-4">
                        {
                            (introInfos.bio && !addBio && !editBio) ? (
                                <>
                                    <IntroButton buttonText="Edit bio" onClick={() => setEditBio(true)} />
                                </>
                            )
                                :
                                addBio ? <AddBio loading={loading} onCancel={handleCancelBioAdding} onSave={handleSaveIntro} />
                                    :
                                    editBio ? <EditBio loading={loading} bio={introInfos.bio} onCancel={handleCancelBioEditing} onSave={handleSaveIntro} />
                                        :
                                        <IntroButton buttonText="Add bio" onClick={() => setAddBio(true)} />
                        }

                        <IntroButton buttonText="Edit details" />
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProfileIntro