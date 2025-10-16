import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./slices/authSlice"
import { authApi } from '../api/authApi'

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        auth: authReducer
    },
    middleware: (getDefaultMiddlware) => {
        getDefaultMiddlware().concat(authApi.middleware);
    }
})