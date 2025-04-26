import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, Trash2, Edit3, Plus, Save } from "lucide-react";
import moment from "moment";
import { uploadFiles } from "../../api/upload";
import { Report, ReportedUser, ReportFilter } from "../../utils/report.type";
import { useUpdateReport } from "../../hooks/report/useUpdateReport";
import { useDeleteReport } from "../../hooks/report/useDeleteReport";
import { useCreateReport } from "../../hooks/report/useCreateReport";
import { resolveReport } from "../../api/report";

interface Props {
    report?: Report;
    mode: "create" | "edit";
    onClose: () => void;
    onUpdate: () => void;
}

export const ReportModal = ({ report, mode, onClose, onUpdate }: Props) => {
    const [current, setCurrent] = useState(0);
    const [fullscreen, setFullscreen] = useState(false);
    const [isEditing, setIsEditing] = useState(mode === "create");
    const [text, setText] = useState(report?.text || "");
    const [location, setLocation] = useState(report?.location || "");
    const [assets, setAssets] = useState<string[]>(report?.assets || []);
    const [loading, setLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); const [isResolveMode, setIsResolveMode] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<ReportFilter>(report?.status || "UNDER_REVIEW");

    const { mutate: updateReport } = useUpdateReport();
    const { mutate: deleteReport, isLoading: isDeleting } = useDeleteReport();
    const { mutate: createReport } = useCreateReport();
    const modalRef = useRef<HTMLDivElement | null>(null); 

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose(); 
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [onClose]);

    const resetEditState = () => {
        if (report) {
            setText(report.text);
            setLocation(report.location);
            setAssets(report.assets);
            setCurrent(0);
        }
    };

    const handleRemoveImage = (index: number) => {
        const updated = [...assets];
        updated.splice(index, 1);
        setAssets(updated);
        if (current >= updated.length) setCurrent(Math.max(0, updated.length - 1));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const fileArray = Array.from(files);
        if (assets.length + fileArray.length > 3) return;

        setLoading(true);
        try {
            const urls = await uploadFiles(fileArray);
            if (urls) setAssets([...assets, ...urls]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (mode === "edit" && report) {
            const success = await updateReport(report._id, { text, location, assets });
            if (success) {
                onUpdate();
                onClose();
            }
        } else if (mode === "create") {
            const success = await createReport({ text, location, assets });
            if (success) {
                onUpdate();
                onClose();
            }
        }
    };

    const handleDelete = () => {
        if (!report) return;
        deleteReport(report._id, {
            onSuccess: () => {
                onUpdate();
                onClose();
            },
        });
    };

    const toggleEdit = () => {
        if (isEditing && mode === "edit") {
            resetEditState();
        }
        setIsEditing(!isEditing);
    };

    const openDeleteModal = () => setIsDeleteModalOpen(true);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isAdmin = user?.role === "ADMIN";

    return createPortal(
        <AnimatePresence>
            <motion.div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.div ref={modalRef} className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
                    <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-black transition">
                        <X size={24} />
                    </button>

                    <div className="p-6 flex flex-col gap-4">
                        {/* Main Image */}
                        {assets.length > 0 && (
                            <div className="relative w-full h-96 rounded-xl overflow-hidden">
                                <img
                                    src={assets[current]}
                                    alt={`report-${current}`}
                                    className="w-full h-full object-cover rounded-xl cursor-pointer"
                                    onClick={() => setFullscreen(true)}
                                />
                                <div className="absolute bottom-3 right-3 bg-white/70 rounded-full p-1 cursor-pointer" onClick={() => setFullscreen(true)}>
                                    <Maximize2 size={18} />
                                </div>

                                {loading && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl z-10">
                                        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Thumbnails */}
                        {assets.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto">
                                {assets.map((thumb, i) => (
                                    <div key={i} className="relative">
                                        <img
                                            src={thumb}
                                            alt={`thumb-${i}`}
                                            className={`w-20 h-16 object-cover rounded-md border-2 ${i === current ? "border-blue-500" : "border-transparent"} cursor-pointer`}
                                            onClick={() => setCurrent(i)}
                                        />
                                        {isEditing && (
                                            <button
                                                onClick={() => handleRemoveImage(i)}
                                                className="cursor-pointer absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 flex items-center justify-center"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {isEditing && assets.length < 3 && (
                            <label className="flex items-center gap-2 text-sm text-blue-600 cursor-pointer w-fit">
                                <Plus size={16} /> Add Images
                                <input type="file" accept="image/*" multiple hidden onChange={handleImageUpload} />
                            </label>
                        )}

                        {/* Details */}
                        <div className="flex flex-col gap-2">
                            {isEditing ? (
                                <textarea
                                    placeholder="Describe the issue or provide more details..."
                                    value={text} onChange={(e) => setText(e.target.value)} className="border rounded-lg p-2 w-full" rows={3} />
                            ) : (
                                <p className="text-xl font-semibold text-gray-800">{text}</p>
                            )}

                            {isEditing ? (
                                <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="border rounded-lg p-2 text-sm" />
                            ) : (
                                <p className="text-sm text-gray-600">📍 Location: {location}</p>
                            )}

                            {report && mode === "edit" && (
                                <>
                                    <p className={`text-sm font-medium ${report.status === "UNDER_REVIEW" ? "text-yellow-600" : "text-green-600"}`}>
                                        Status: {report.status.replace("_", " ")}
                                    </p>
                                    <p className="text-xs text-gray-500">🕒 Created: {moment(report.createdAt).format("LLL")}</p>
                                    <p className="text-xs text-gray-400">Last Updated: {moment(report.updatedAt).fromNow()}</p>
                                </>
                            )}

                            {isAdmin && report && report.reportedUserId && (
                                <div className="bg-gray-100 p-4 rounded-lg mt-4">
                                    <h3 className="text-lg font-semibold">Reported User Info</h3>
                                    <div className="flex items-center gap-4 mt-2">
                                        <img
                                            src={(report.reportedUserId as ReportedUser).profileImg || '/path/to/default-profile.png'}
                                            alt={(report.reportedUserId as ReportedUser).name}
                                            className="w-16 h-16 object-cover rounded-full"
                                        />
                                        <div>
                                            <p className="text-lg font-medium">{(report.reportedUserId as ReportedUser).name}</p>
                                            <p className="text-sm text-gray-600">{(report.reportedUserId as ReportedUser).email}</p>
                                        </div>
                                    </div>
                                </div>
                            )}


                            {isAdmin && mode === "edit" && (
                                <>
                                    {isResolveMode ? (
                                        <div className="flex items-center justify-between gap-2">
                                            <select
                                                value={selectedStatus}
                                                onChange={(e) => setSelectedStatus(e.target.value as ReportFilter)}
                                                className="border px-3 py-2 rounded-lg text-sm"
                                            >
                                                <option value="UNDER_REVIEW">Under Review</option>
                                                <option value="ACTION_TAKEN">Action Taken</option>
                                            </select>
                                            <button
                                                onClick={async () => {
                                                    const updated = await resolveReport(report!._id, selectedStatus);
                                                    if (updated) {
                                                        onUpdate();
                                                        onClose();
                                                    }
                                                }}
                                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    ) : (
                                        <button className="bg-blue-100 text-blue-600 px-4 py-2 mt-5 rounded-lg hover:bg-blue-200"
                                            onClick={() => setIsResolveMode(true)}
                                        >
                                            Resolve
                                        </button>
                                    )}
                                </>
                            )}

                        </div>

                        <div className="flex justify-end flex-wrap gap-2 mt-4">
                            {!isAdmin && mode === "edit" && report?.status === "UNDER_REVIEW" && (
                                <button className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 disabled:opacity-50" onClick={openDeleteModal} disabled={isDeleting}>
                                    <Trash2 size={16} className="inline mr-1" /> {isDeleting ? "Deleting..." : "Delete"}
                                </button>
                            )}

                            {isEditing && (
                                <button className="cursor-pointer bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200" onClick={handleSubmit}>
                                    <Save size={16} className="inline mr-1" /> {mode === "create" ? "Create Report" : "Save Changes"}
                                </button>
                            )}

                            {!isAdmin && mode === "edit" && report?.status === "UNDER_REVIEW" && (
                                <button className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200" onClick={toggleEdit}>
                                    <Edit3 size={16} className="inline mr-1" /> {isEditing ? "Cancel Edit" : "Edit"}
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Fullscreen Viewer */}
                {fullscreen && (
                    <motion.div className="fixed inset-0 z-50 bg-black flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFullscreen(false)}>
                        <img src={assets[current]} alt="fullscreen" className="max-w-full max-h-full object-contain" />
                        <button className="absolute top-5 right-5 text-white">
                            <X size={30} />
                        </button>
                    </motion.div>
                )}

                {/* Delete Confirmation Modal */}
                {isDeleteModalOpen && (
                    <motion.div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className="bg-white rounded-xl shadow-xl w-96 p-6" initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
                            <div className="flex flex-col gap-4">
                                <h3>Are you sure you want to delete this report?</h3>
                                <div className="flex justify-end gap-2">
                                    <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200" onClick={closeDeleteModal}>
                                        Cancel
                                    </button>
                                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700" onClick={handleDelete}>
                                        {isDeleting ? "Deleting..." : "Delete"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>,
        document.body
    );
};
