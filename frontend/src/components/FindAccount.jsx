import { useState } from "react";
import { useFindUserMutation } from "../../api/authApi";

const FindAccount = ({setUser, setVisibility}) => {
    const [email, setEmail] = useState("");
    const [findUser, {isLoading, error}] = useFindUserMutation();

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const res = await findUser(email);

            if(res.data?.email && res.data?.email.trim() !== "") {
                setUser(res.data);
                setVisibility(1);
            }
        }
        catch (e) {
            console.log(e.message);
        }
    }

    return (
        <div>
            {error && <p className="text-xl text-red-500">{error.data.error}</p>}
            <p className="text-xl mb-3">Find your account</p>

            <form onSubmit={handleSubmit}>
                <input
                    className="px-2 py-2 border" type="email" placeholder="Your email" name="email"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                />

                <button type="submit" className="bg-[dodgerblue] py-2.5 px-5 rounded ml-5 cursor-pointer">{isLoading ? "Searching..." : "Search"}</button>
            </form>
        </div>
    )
}

export default FindAccount