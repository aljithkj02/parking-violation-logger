import { toast } from "react-hot-toast";
import { api } from "./axios";
import { ReportFilter, ReportResponse } from "../utils/report.type";

// GET Report
export const getReports = async (
    page: number,
    limit: number,
    filter?: ReportFilter
): Promise<ReportResponse | null> => {
    try {
        const query = new URLSearchParams({
            page: String(page),
            limit: String(limit),
            ...(filter && { filter }),
        }).toString();

        const res = await api.get(`/report?${query}`);
        return res.data;
    } catch (error: any) {
        toast.dismiss();
        toast.error(error?.response?.data?.message || "Failed to fetch reports");
        return null;
    }
};


// CREATE Report
export const createReport = async (data: {
    text: string;
    location: string;
    assets: string[];
}): Promise<Report | null> => {
    try {
        const res = await api.post("/report", data);
        toast.success("Reported successfully");
        return res.data;
    } catch (error: any) {
        toast.dismiss();
        toast.error(error?.response?.data?.message || "Failed to create report");
        return null;
    }
};

// UPDATE Report
export const updateReport = async (
    id: string,
    data: {
        text: string;
        location: string;
        assets: string[];
    }
): Promise<Report | null> => {
    try {
        const res = await api.put(`/report/${id}`, data);
        toast.success("Report updated successfully");
        return res.data;
    } catch (error: any) {
        toast.dismiss();
        toast.error(error?.response?.data?.message || "Failed to update report");
        return null;
    }
};

// DELETE Report
export const deleteReport = async (id: string): Promise<boolean> => {
    try {
        await api.delete(`/report/${id}`);
        toast.success("Report deleted successfully");
        return true;
    } catch (error: any) {
        toast.dismiss();
        toast.error(error?.response?.data?.message || "Failed to delete report");
        return false;
    }
};

// RESOLVE Report
export const resolveReport = async (
    id: string, status: ReportFilter
): Promise<Report | null> => {
    try {
        const res = await api.put(`/report/resolve/${id}`, {
            status,
        });
        toast.success("Report resolved successfully");
        return res.data;
    } catch (error: any) {
        toast.dismiss();
        toast.error(error?.response?.data?.message || "Failed to resolve report");
        return null;
    }
};
