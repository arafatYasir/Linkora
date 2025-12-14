import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./slices/authSlice"
import { authApi } from '../api/authApi'
import postsReducer from "./slices/postsSlice"

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        auth: authReducer,
        posts: postsReducer
    },
    devTools: import.meta.env.MODE !== "production",
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware)
})