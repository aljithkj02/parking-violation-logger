import toast from "react-hot-toast";
import { api } from "./axios";

export const uploadFiles = async (files: File[]): Promise<string[] | null> => {
    const formData = new FormData();

    files.forEach((file) => {
        formData.append("files", file);
    });

    try {
        const res = await api.post("/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        toast.dismiss();
        toast.success("Files uploaded successfully!");

        return res.data.data;
    } catch (error: any) {
        toast.dismiss();
        toast.error(error?.response?.data?.message || "File upload failed");
        return null;
    }
};
