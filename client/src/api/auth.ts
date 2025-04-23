
import { toast } from "react-hot-toast";
import { api } from "./axios";

export interface SignupPayload {
    name: string;
    email: string;
    password: string;
    role: "ADMIN" | "USER";
}

export interface LoginPayload {
    email: string;
    password: string;
    role: "ADMIN" | "USER";
}

export interface AuthResponse {
    message: string;
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: "ADMIN" | "USER";
    };
}

export const signup = async (data: SignupPayload): Promise<AuthResponse | null> => {
    try {
        const res = await api.post("/auth/signup", data);
        toast.dismiss();
        toast.success("Signup successful!");

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        return res.data;
    } catch (error: any) {
        toast.dismiss();
        toast.error(error?.response?.data?.message || "Signup failed");
        return null;
    }
};

export const login = async (data: LoginPayload): Promise<AuthResponse | null> => {
    try {
        const res = await api.post("/auth/login", data);
        toast.dismiss();
        toast.success("Login successful!");

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        return res.data;
    } catch (error: any) {
        toast.dismiss();
        toast.error(error?.response?.data?.message || "Login failed");
        return null;
    }
};
