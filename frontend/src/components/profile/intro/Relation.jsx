import { FaHeart } from "react-icons/fa";

const Relation = ({relationType}) => {
    return (
        <p className="flex items-center gap-x-3">
            <FaHeart size={17} className="shrink-0" />
            <span className="text-[15px]">{relationType}</span>
        </p>
    )
}

export default Relation