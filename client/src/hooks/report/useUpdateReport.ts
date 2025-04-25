import { toast } from "react-hot-toast";
import { updateReport } from "../../api/report";
import { Report } from "../../utils/report.type";

export const useUpdateReport = () => {
    const mutate = async (id: string, data: Omit<Report, "_id" | "status" | "createdAt" | "updatedAt" | "reportedUserId">) => {
        try {
            toast.loading("Updating report...");
            await updateReport(id, data);
            toast.dismiss();
            toast.success("Report updated successfully");
            return true;
        } catch (error: any) {
            toast.dismiss();
            toast.error(error?.response?.data?.message || "Failed to update report");
            return false;
        }
    };

    return { mutate };
};