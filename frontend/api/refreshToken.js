import { jwtDecode } from "jwt-decode";
import { logOutUser, setUser } from "../src/slices/authSlice";

const isTokenExpired = (accessToken) => {
    try {
        const decodedToken = jwtDecode(accessToken);
        const currentTime = Date.now() / 1000;

        return decodedToken.exp < currentTime;
    }
    catch (e) {
        console.log(e.message);
        return true;
    }
}

export const refreshToken = async (api) => {
    const user = JSON.parse(localStorage.getItem("userInfo")) || null;

    if (!user) {
        console.log("User not found!");
        return;
    }

    if (isTokenExpired(user.accessToken)) {
        try {
            const res = await fetch("http://localhost:8000/api/v1/refresh", {
                method: "POST",
                credentials: "include",
            });
            const newAccessToken = await res.json();

            if (!newAccessToken.error) {
                user.accessToken = newAccessToken.accessToken;

                localStorage.setItem("userInfo", JSON.stringify(user));
                api.dispatch(setUser(user));
                return newAccessToken.accessToken;
            }
            else {
                // Log out if not refreshed the token
                localStorage.removeItem("userInfo");
                api.dispatch(logOutUser());
                return null;
            }
            
        } catch (e) {
            console.error("Error refreshing the token: ", e.message);
        }
    }
}