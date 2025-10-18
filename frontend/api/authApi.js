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
        }),
        findUser: build.mutation({
            query: (email) => ({
                url: "/api/v1/findUser",
                method: "POST",
                body: {email},
            })
        }),
        sendResetCode: build.mutation({
            query: (email) => ({
                url: "/api/v1/reset-code",
                method: "POST",
                body: {email},
            })
        }),
        verifyResetCode: build.mutation({
            query: ({email, code}) => ({
                url: "/api/v1/verify-code",
                method: "POST",
                body: {email, code}
            })
        }),
        newPassword: build.mutation({
            query: ({email, password}) => ({
                url: "/api/v1/new-password",
                method: "POST",
                body: {email, password}
            })
        })
    }),
})

export const { useAddUserMutation, useLoginUserMutation, useVerifyUserMutation, useFindUserMutation, useSendResetCodeMutation, useVerifyResetCodeMutation, useNewPasswordMutation } = authApi;