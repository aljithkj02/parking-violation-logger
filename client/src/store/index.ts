import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice'
import reportReducer from './slices/reportSlice'
import dashboardReducer from './slices/dashboardSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        report: reportReducer,
        dashboard: dashboardReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
