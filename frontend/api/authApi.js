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
                body: { token },
            })
        }),
        findUser: build.mutation({
            query: (email) => ({
                url: "/api/v1/findUser",
                method: "POST",
                body: { email },
            })
        }),
        sendResetCode: build.mutation({
            query: (email) => ({
                url: "/api/v1/reset-code",
                method: "POST",
                body: { email },
            })
        }),
        verifyResetCode: build.mutation({
            query: ({ email, code }) => ({
                url: "/api/v1/verify-code",
                method: "POST",
                body: { email, code }
            })
        }),
        newPassword: build.mutation({
            query: ({ email, password }) => ({
                url: "/api/v1/new-password",
                method: "POST",
                body: { email, password }
            })
        }),
        createPost: build.mutation({
            query: ({ type, images, text, background, user }) => ({
                url: "/api/v1/posts/create-post",
                method: "POST",
                body: { type, images, text, background, user },
            })
        }),
        getAllPosts: build.query({
            query: (dummy) => "/api/v1/posts/get-all-posts"
        }),
        getUserPosts: build.query({
            query: (id) => `/api/v1/posts/get-user-posts/${id}`
        }),
        getUser: build.query({
            query: (username) => `/api/v1/get-user/${username}`
        }),
        uploadImage: build.mutation({
            query: ({ formData }) => ({
                url: "/api/v1/upload/image",
                method: "POST",
                body: formData,
            })
        }),
        listImages: build.query({
            query: ({ path, sorting, maxLimit }) => ({
                url: "/api/v1/upload/list-images",
                method: "GET",
                params: { path, sorting, maxLimit }
            })
        }),
        updateProfilePicture: build.mutation({
            query: ({ url }) => ({
                url: "/api/v1/update-profile-picture",
                method: "PUT",
                body: { url: url }
            })
        }),
        updateCoverPhoto: build.mutation({
            query: ({ url }) => ({
                url: "/api/v1/update-cover-photo",
                method: "PUT",
                body: { url: url }
            })
        }),
        updateProfileIntro: build.mutation({
            query: (intro) => ({
                url: "/api/v1/update-profile-intro",
                method: "PUT",
                body: { intro }
            })
        }),
        addFriend: build.mutation({
            query: (id) => ({
                url: `/api/v1/add-friend/${id}`,
                method: "POST",
            })
        }),
        acceptRequest: build.mutation({
            query: (id) => ({
                url: `/api/v1/accept-request/${id}`,
                method: "POST",
            })
        }),
        cancelRequest: build.mutation({
            query: (id) => ({
                url: `/api/v1/cancel-request/${id}`,
                method: "DELETE",
            })
        }),
        follow: build.mutation({
            query: (id) => ({
                url: `/api/v1/follow/${id}`,
                method: "POST",
            })
        }),
        unfollow: build.mutation({
            query: (id) => ({
                url: `/api/v1/unfollow/${id}`,
                method: "DELETE",
            })
        }),
        unfriend: build.mutation({
            query: (id) => ({
                url: `/api/v1/unfriend/${id}`,
                method: "DELETE",
            })
        }),
        deleteRequest: build.mutation({
            query: (id) => ({
                url: `/api/v1/delete-request/${id}`,
                method: "DELETE",
            })
        }),
        reactPost: build.mutation({
            query: ({ react, postId }) => ({
                url: `/api/v1/posts/react-post`,
                method: "PUT",
                body: { react, postId }
            })
        }),
        commentPost: build.mutation({
            query: ({ comment, image, postId }) => ({
                url: `/api/v1/posts/comment-post`,
                method: "POST",
                body: { comment, image, postId }
            })
        }),
        savePost: build.mutation({
            query: (id) => ({
                url: `/api/v1/posts/save-post/${id}`,
                method: "POST",
            })
        }),
        deletePost: build.mutation({
            query: (id) => ({
                url: `/api/v1/posts/delete-post/${id}`,
                method: "DELETE",
            })
        }),
        search: build.query({
            query: (query) => ({
                url: `/api/v1/search/${query}`,
                method: "GET"
            })
        }),
        addToSearchHistory: build.mutation({
            query: (searchedUser) => ({
                url: `/api/v1/add-to-search-history`,
                method: "PUT",
                body: { searchedUser }
            })
        }),
        getSearchHistory: build.query({
            query: () => ({
                url: "/api/v1/search-history",
                method: "GET"
            })
        }),
    }),
})

export const { useAddUserMutation, useLoginUserMutation, useVerifyUserMutation, useFindUserMutation, useSendResetCodeMutation, useVerifyResetCodeMutation, useNewPasswordMutation, useCreatePostMutation, useUploadImageMutation, useGetAllPostsQuery, useGetUserPostsQuery, useGetUserQuery, useListImagesQuery, useUpdateProfilePictureMutation, useUpdateCoverPhotoMutation, useUpdateProfileIntroMutation, useAddFriendMutation, useCancelRequestMutation, useAcceptRequestMutation, useFollowMutation, useUnfollowMutation, useUnfriendMutation, useDeleteRequestMutation, useReactPostMutation, useCommentPostMutation, useSavePostMutation, useDeletePostMutation, useSearchQuery, useLazySearchQuery, useAddToSearchHistoryMutation, useGetSearchHistoryQuery } = authApi;