import { LuFiles } from 'react-icons/lu';
import { MdOutlineFileUpload } from "react-icons/md";
import { LuFullscreen } from "react-icons/lu";
import { GoTrash } from "react-icons/go";

export const editOptions = [
    {
        id: 1,
        name: "Choose cover photo",
        icon: LuFiles
    },
    {
        id: 2,
        name: "Upload photo",
        icon: MdOutlineFileUpload
    },
    {
        id: 3,
        name: "Reposition",
        icon: LuFullscreen
    },
    {
        id: 4 ,
        name: "Remove",
        icon: GoTrash
    },
];