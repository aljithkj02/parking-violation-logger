
import { toast } from "react-hot-toast";
import { api } from "./axios";

export interface UpdateProfilePayload {
    name: string;
    profileImg?: string;
}

export interface UpdateProfileResponse {
    message: string;
    status: boolean;
    data: {
        id: string;
        name: string;
        email: string;
        role: "ADMIN" | "USER";
        profileImg?: string;
    };
}

export const updateProfile = async (
    data: UpdateProfilePayload
): Promise<UpdateProfileResponse | null> => {
    try {
        const res = await api.put("/profile", data);
        toast.dismiss();
        toast.success("Profile updated successfully!");

        localStorage.setItem("user", JSON.stringify(res.data.data));

        return res.data;
    } catch (error: any) {
        toast.dismiss();
        toast.error(error?.response?.data?.message || "Failed to update profile");
        return null;
    }
};

