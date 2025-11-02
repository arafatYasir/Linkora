import { VscSettings } from "react-icons/vsc";
import { IoIosSettings } from "react-icons/io";
import { BsList } from "react-icons/bs";
import { BiSolidGridAlt } from "react-icons/bi";

const PostViewControl = ({viewMethod, setViewMethod}) => {
    return (
        <div className="w-full bg-[var(--color-surface)] px-4 pt-4 rounded-[var(--radius-card)] shadow-[var(--shadow-dark)] border border-[var(--color-border)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.6)] transition-[var(--transition-default)]">
            <div className="flex items-center justify-between border-b border-b-[var(--color-border)] pb-2">
                <span className="text-xl font-bold leading-6">Posts</span>

                <div className="flex items-center gap-x-2">
                    <button className="flex items-center gap-x-1 px-3 py-2 rounded-lg cursor-pointer bg-border hover:bg-primary/50 transition-all duration-250">
                        <VscSettings size={20} />
                        <span className="text-[15px] leading-5 font-semibold">Filters</span>
                    </button>
                    <button className="flex items-center gap-x-1 px-3 py-2 rounded-lg cursor-pointer bg-border hover:bg-primary/50 transition-all duration-250">
                        <IoIosSettings size={20} />
                        <span className="text-[15px] leading-5 font-semibold">Manage Posts</span>
                    </button>
                </div>
            </div>

            <div className="flex mt-1">
                <button 
                    className={`flex items-center justify-center gap-x-1 w-1/2 py-1.5 cursor-pointer transition-all duration-250 ${viewMethod === "list" ? "border-b-3 border-b-primary rounded-none hover:bg-transparent text-primary" : "border-b-3 border-b-transparent rounded-lg hover:bg-primary/50"}`}
                    onClick={() => setViewMethod("list")}
                >
                    <BsList size={20} />
                    <span className="font-medium">List view</span>
                </button>
                <button 
                    className={`flex items-center justify-center gap-x-1 w-1/2 py-1.5 cursor-pointer transition-all duration-250 ${viewMethod === "grid" ? "border-b-3 border-b-primary rounded-none hover:bg-transparent text-primary" : "border-b-3 border-b-transparent rounded-lg hover:bg-primary/50"}`}
                    onClick={() => setViewMethod("grid")}
                >
                    <BiSolidGridAlt size={20} />
                    <span className="font-medium">Grid view</span>
                </button>
            </div>
        </div>
    )
}

export default PostViewControl