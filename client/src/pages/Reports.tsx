import { useState } from "react";
import { useReports } from "../hooks/report/useReports";
import { ReportCard } from "../components/report/ReportCard";
import { ReportModal } from "../components/report/ReportModal";
import { Report, ReportFilter } from "../utils/report.type";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { refetchData } from "../store/slices/reportSlice";
import { Loader } from "../components/common/Loader";

export const Reports = () => {
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [filter, setFilter] = useState<ReportFilter | 'all'>('all');
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

    const { data, loading, error, totalPages } = useReports(page, limit, filter);

    const dispatch = useAppDispatch();

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const isAdmin = user.role === "ADMIN";

    const filterOptions = [
        { value: 'all', label: 'All Reports' },
        { value: 'ACTION_TAKEN', label: 'Action Taken' },
        { value: 'UNDER_REVIEW', label: 'Under Review' },
    ];

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newFilter = event.target.value as ReportFilter;
        setFilter(newFilter);
    };

    return (
        <div className="px-4">
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
                {isAdmin ? "Citizen Reports" : "My Reports"}
            </h1>

            <div className="mb-4 flex justify-end">
                <select
                    value={filter}
                    onChange={handleFilterChange}
                    className="block sm:w-40 mt-1 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ease-in-out"
                >
                    {filterOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>


            {loading ? (
                <Loader />
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : data.length === 0 ? (
                <div className="text-center text-gray-500">
                    <p>No reports available yet.</p>
                    <p className="mt-2 text-sm text-gray-400">Please check back later or submit a new report.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.map((report) => (
                            <div key={report._id} onClick={() => setSelectedReport(report)}>
                                <ReportCard report={report} />
                            </div>
                        ))}
                    </div>

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
                </>
            )}

            {selectedReport && (
                <ReportModal report={selectedReport} onClose={() => setSelectedReport(null)}
                    onUpdate={() => dispatch(refetchData())} mode="edit"
                />
            )}
        </div>
    );
};
