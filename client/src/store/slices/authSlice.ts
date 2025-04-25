import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User } from "../../utils/auth.type";

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: User; token: string }>
        ) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        },
        setUser: (
            state,
            action: PayloadAction<User>
        ) => {
            state.user = action.payload;
        }
    },
});

export const { setCredentials, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
