import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { refreshToken } from "./refreshToken";

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo")) || null;

        if (userInfo && userInfo.accessToken) {
            headers.set("Authorization", `Bearer ${userInfo.accessToken}`)
        }

        return headers;
    }
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        const newAccessToken = await refreshToken(api); // sending this api so that refreshToken can set accessToken to redux store

        if (newAccessToken) {
            const updatedHeaders = {
                ...(typeof args === "object" && args.headers ? args.headers : {}),
                Authorization: `Bearer ${newAccessToken}`
            };

            const retryArgs = (typeof args === "string") ? { url: args, headers: updatedHeaders } : { ...args, headers: updatedHeaders };

            result = await baseQuery(retryArgs, api, extraOptions);
        }
    }

    return result;
}