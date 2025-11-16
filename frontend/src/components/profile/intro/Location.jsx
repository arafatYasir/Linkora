import { FaLocationDot } from "react-icons/fa6";
import { FaHouseChimney } from "react-icons/fa6";

const Location = ({ type, location }) => {
    return (
        <p className="flex items-center gap-x-3">
            {
                type === "currentCity" ? <FaHouseChimney size={17} className="shrink-0" /> : <FaLocationDot size={17} className="shrink-0" />
            }
            <span className="text-[15px]">{type === "currentCity" ? "Lives in" : "From"} {location}</span>
        </p>
    )
}

export default Location