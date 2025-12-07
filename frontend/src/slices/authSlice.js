import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userInfo: JSON.parse(localStorage.getItem("userInfo")) || null,
    theme: localStorage.getItem("theme") || "light"
}

export const authSlice = createSlice({
    name: 'authSlice',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.userInfo = action.payload;
        },
        updatePosts: (state, action) => {
            state.userInfo.posts = [...action.payload];
        },
        setProfilePicture: (state, action) => {
            state.userInfo.profilePicture = action.payload;
        },
        setCoverPhoto: (state, action) => {
            state.userInfo.coverPhoto = action.payload;
            console.log(action.payload);
        },
        setIntro: (state, action) => {
            state.userInfo.details = action.payload;
        },
        logOutUser: (state) => {
            state.userInfo = null;
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
        }
    },
})

export const { setUser, updatePosts, setProfilePicture, setCoverPhoto, setIntro, logOutUser, setTheme } = authSlice.actions

export default authSlice.reducer