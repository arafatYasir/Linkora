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
        logOutUser: (state) => {
            state.userInfo = null;
        }
    },
})

// Action creators are generated for each case reducer function
export const { setUser, logOutUser } = authSlice.actions

export default authSlice.reducer