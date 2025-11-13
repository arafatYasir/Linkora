import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userInfo: JSON.parse(localStorage.getItem("userInfo")) || null,
}

export const authSlice = createSlice({
    name: 'authSlice',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.userInfo = action.payload;
        },
        addPost: (state, action) => {
            state.userInfo.posts = [...state.userInfo.posts, action.payload];
        },
        updatePosts: (state, action) => {
            state.userInfo.posts = [...action.payload];
        },
        setProfilePicture: (state, action) => {
            state.userInfo.profilePicture = action.payload;
        },
        setCoverPhoto: (state, action) => {
            state.userInfo.coverPhoto = action.payload;
        },
        logOutUser: (state) => {
            state.userInfo = null;
        }
    },
})

// Action creators are generated for each case reducer function
export const { setUser, addPost, updatePosts, setProfilePicture, setCoverPhoto, logOutUser } = authSlice.actions

export default authSlice.reducer