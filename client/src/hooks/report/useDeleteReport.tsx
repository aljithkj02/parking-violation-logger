import { toast } from "react-hot-toast";
import { deleteReport } from "../../api/report";
import { useState } from "react";

export const useDeleteReport = () => {
    const [isLoading, setIsLoading] = useState(false);

    const mutate = async (id: string, { onSuccess }: { onSuccess?: () => void }) => {
        try {
            toast.loading("Deleting report...");
            setIsLoading(true);
            await deleteReport(id);
            setIsLoading(false);
            toast.dismiss();
            toast.success("Report deleted successfully");
            if (onSuccess) onSuccess();
            return true;
        } catch (error: any) {
            setIsLoading(false);
            toast.dismiss();
            toast.error(error?.response?.data?.message || "Failed to delete report");
            return false;
        }
    };

    return { mutate, isLoading };
};
