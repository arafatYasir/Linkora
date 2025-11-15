import { FaGraduationCap } from "react-icons/fa6";

const Education = ({ name }) => {
    return (
        <p className="flex items-center gap-x-3">
            <FaGraduationCap size={18} className="shrink-0" />
            <span className="text-[15px]">Went to {name}</span>
        </p>
    )
}

export default Education