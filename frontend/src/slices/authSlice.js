import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userInfo: null
}

export const authSlice = createSlice({
    name: 'authSlice',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.userInfo = action.payload;
        }
    },
})

// Action creators are generated for each case reducer function
export const { setUser } = authSlice.actions

export default authSlice.reducer