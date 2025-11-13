import { FaHeart } from "react-icons/fa";

const Relation = ({relationType}) => {
    return (
        <p className="flex items-center gap-x-1.5">
            <FaHeart size={18} />
            <span>{relationType}</span>
        </p>
    )
}

export default Relation