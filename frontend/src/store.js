import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./slices/authSlice"
import { authApi } from '../api/authApi'

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        auth: authReducer
    },
    devTools: import.meta.env.MODE !== "production",
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware)
})