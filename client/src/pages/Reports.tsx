import { useState } from "react";
import { useReports } from "../hooks/report/useReports";
import { ReportCard } from "../components/report/ReportCard";
import { ReportModal } from "../components/report/ReportModal";
import { Report } from "../utils/report.type";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { refetchData } from "../store/slices/reportSlice";

export const Reports = () => {
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

    const { data, loading, error, totalPages } = useReports(page, limit);

    const dispatch = useAppDispatch();

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const isAdmin = user.role === "ADMIN";

    return (
        <div className="px-4">
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
                {isAdmin ? "Citizen Reports" : "My Reports"}
            </h1>
            {loading ? (
                <p className="text-center">Loading...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.map((report) => (
                        <div key={report._id} onClick={() => setSelectedReport(report)}>
                            <ReportCard report={report} />
                        </div>
                    ))}

                </div>
            )}
            <div className="flex justify-center items-center gap-4 mt-6">
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                >
                    Prev
                </button>
                <span className="text-gray-700">Page {page} of {totalPages}</span>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={page >= totalPages}
                >
                    Next
                </button>
            </div>

            {selectedReport && (
                <ReportModal report={selectedReport} onClose={() => setSelectedReport(null)}
                    onUpdate={() => dispatch(refetchData())} mode="edit"
                />
            )}
        </div>
    );
};
