import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),
    endpoints: (build) => ({
        addUser: build.mutation({
            query: (body) => ({
                url: "/api/v1/signup",
                method: "POST",
                body
            })
        }),
        loginUser: build.mutation({
            query: (body) => ({
                url: "/api/v1/login",
                method: "POST",
                body
            })
        }),
        verifyUser: build.mutation({
            query: (token) => ({
                url: "/api/v1/verify",
                method: "POST",
                body: {token},
            })
        })
    }),
})

export const { useAddUserMutation, useLoginUserMutation, useVerifyUserMutation } = authApi;