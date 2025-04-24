import { toast } from "react-hot-toast";
import { createReport } from "../../api/report";
import { Report } from "../../utils/report.type";

export const useCreateReport = () => {
    const mutate = async (data: Omit<Report, "_id" | "status" | "createdAt" | "updatedAt">) => {
        try {
            toast.loading("Creating report...");
            await createReport(data);
            toast.dismiss();
            toast.success("Report created successfully");
            return true;
        } catch (error: any) {
            toast.dismiss();
            toast.error(error?.response?.data?.message || "Failed to create report");
            return false;
        }
    };

    return { mutate };
};
