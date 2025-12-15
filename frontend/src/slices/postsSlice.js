import { createSlice } from '@reduxjs/toolkit'

export const postsSlice = createSlice({
    name: 'postsSlice',
    initialState: {
        posts: []
    },
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload;
        },
        addPost: (state, action) => {
            state.posts.unshift(action.payload);
        },
        postDelete: (state, action) => { 
            state.posts = state.posts.filter(post => post._id !== action.payload);
        }
    },
})

export const { setPosts, addPost, postDelete } = postsSlice.actions

export default postsSlice.reducer