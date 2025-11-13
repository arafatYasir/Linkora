import { useSelector } from "react-redux";
import Bio from "./Bio";
import IntroButton from "./IntroButton";
import { useEffect, useState } from "react";

const ProfileIntro = ({ user, details }) => {
    // States
    const [isIntroEmpty, setIsIntroEmpty] = useState(true);

    // Redux states
    const { userInfo } = useSelector(state => state.auth);

    // useEffect to check if intro is empty
    useEffect(() => {
        const values = Object.values(details);        
        
        values.forEach(value => {
            if(value?.length > 0 || value !== "") {
                setIsIntroEmpty(false);           
                return;
            }
        });
    }, [details]);

    if(isIntroEmpty) return;

    return (
        <div className="w-full max-w-[640px] bg-[var(--color-surface)] p-4 rounded-[var(--radius-card)] shadow-[var(--shadow-dark)] border border-[var(--color-border)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.6)] transition-[var(--transition-default)] mb-5">
            {/* ---- Header ---- */}
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold leading-6">Intro</h3>
            </div>

            {/* ---- Body ---- */}
            <div>
                
                {/* ---- Intro Editing Section ---- */}
                {user._id === userInfo._id && (
                    <div className="space-y-4 mt-4">
                        {
                            details.bio ? <Bio text={details.bio} /> : <IntroButton buttonText="Add bio" />
                        }

                        <IntroButton buttonText="Edit details" />
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProfileIntro