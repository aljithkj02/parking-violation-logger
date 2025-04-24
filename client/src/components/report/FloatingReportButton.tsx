import { useState } from "react";
import { Plus } from "lucide-react";
import { ReportModal } from "./ReportModal";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { refetchData } from "../../store/slices/reportSlice";

export const FloatingReportButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useAppDispatch();

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={handleOpenModal}
                className="cursor-pointer fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
            >
                <Plus size={24} />
            </button>

            {/* Report Modal */}
            {isModalOpen && (
                <ReportModal
                    report={{ text: "", location: "", assets: [], status: "UNDER_REVIEW", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), _id: "" }}
                    onClose={handleCloseModal}
                    onUpdate={() => dispatch(refetchData())}
                    mode="create"
                />
            )}
        </>
    );
};
