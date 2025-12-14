import { createSlice } from '@reduxjs/toolkit'

export const postsSlice = createSlice({
    name: 'postsSlice',
    initialState: {
        posts: []
    },
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload;
        }
    },
})

export const { setPosts } = postsSlice.actions

export default postsSlice.reducer