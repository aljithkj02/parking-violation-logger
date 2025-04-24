import { toast } from "react-hot-toast";
import { api } from "./axios";
import { ReportFilter, ReportResponse } from "../utils/report.type";

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
