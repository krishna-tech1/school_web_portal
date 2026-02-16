import { configureStore } from '@reduxjs/toolkit';
import studentReducer from '../features/students/studentSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
    reducer: {
        students: studentReducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
