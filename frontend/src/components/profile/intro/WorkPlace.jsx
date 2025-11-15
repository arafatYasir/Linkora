import { FaBriefcase } from "react-icons/fa6";

const WorkPlace = ({text}) => {
    return (
        <p className="flex items-center gap-x-3">
            <FaBriefcase className="shrink-0" />
            <span className="text-[15px]">{text}</span>
        </p>
    )
}

export default WorkPlace