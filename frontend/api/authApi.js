import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithReauth,
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
        }),
        createPost: build.mutation({
            query: ({type, images, text, background, userId}) => ({
                url: "/api/v1/posts/create-post",
                method: "POST",
                body: {type, images, text, background, userId},
            })
        }),
        uploadImage: build.mutation({
            query: ({formData}) => ({
                url: "/api/v1/upload/image",
                method: "POST",
                body: formData,
            })
        }),
        getAllPosts: build.query({
            query: () => "/api/v1/posts/get-all-posts"
        })
    }),
})

export const { useAddUserMutation, useLoginUserMutation, useVerifyUserMutation, useFindUserMutation, useSendResetCodeMutation, useVerifyResetCodeMutation, useNewPasswordMutation, useCreatePostMutation, useUploadImageMutation, useGetAllPostsQuery } = authApi;