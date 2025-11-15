import { FaBriefcase } from "react-icons/fa6";

const WorkPlace = ({text}) => {
    return (
        <p className="flex items-center gap-x-1.5">
            <FaBriefcase />
            {text}
        </p>
    )
}

export default WorkPlace