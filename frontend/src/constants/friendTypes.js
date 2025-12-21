import { FaRegSquarePlus } from "react-icons/fa6";
import { LuUserRoundCheck, LuUserRoundPlus, LuUserRoundX, LuUsersRound } from "react-icons/lu";
import { RiUserSharedLine } from "react-icons/ri";

export const friendTypes = [
    {
        id: 1,
        type: "All Friends",
        url: "/friends",
        icon: LuUsersRound
    },
    {
        id: 2,
        type: "Friend Requests",
        url: "/friends/requests",
        icon: LuUserRoundCheck
    },
    {
        id: 3,
        type: "Sent Requests",
        url: "/friends/sent-requests",
        icon: LuUserRoundX
    },
    {
        id: 4,
        type: "Friend Suggestions",
        url: "/friends/suggestions",
        icon: LuUserRoundPlus
    },
    {
        id: 5,
        type: "Followers",
        url: "/friends/followers",
        icon: FaRegSquarePlus
    },
    {
        id: 6,
        type: "Following",
        url: "/friends/following",
        icon: RiUserSharedLine
    }
];