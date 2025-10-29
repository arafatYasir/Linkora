import { jwtDecode } from "jwt-decode";
import { store } from "../src/store"
import { setUser } from "../src/slices/authSlice";

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

export const refreshToken = async () => {
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
            user.accessToken = newAccessToken.accessToken;

            localStorage.setItem("userInfo", JSON.stringify(user));
            store.dispatch(setUser(user));
        } catch (e) {
            console.log(e.message)
        }
    }
}