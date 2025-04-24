import { useState } from "react";
import { createPortal } from "react-dom";
import { Report } from "../../api/report";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, Trash2, Edit3, Plus } from "lucide-react";
import moment from "moment";
import { uploadFiles } from "../../api/upload";

interface Props {
    report: Report;
    onClose: () => void;
}

export const ReportModal = ({ report, onClose }: Props) => {
    const [current, setCurrent] = useState(0);
    const [fullscreen, setFullscreen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(report.text);
    const [location, setLocation] = useState(report.location);
    const [assets, setAssets] = useState<string[]>(report.assets);

    const handleRemoveImage = (index: number) => {
        const updated = [...assets];
        updated.splice(index, 1);
        setAssets(updated);
        if (current >= updated.length) setCurrent(updated.length - 1);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const fileArray = Array.from(files);
        if (assets.length + fileArray.length > 3) return;

        const urls = await uploadFiles(fileArray);
        if (urls) setAssets([...assets, ...urls]);
    };

    return createPortal(
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-gray-500 hover:text-black transition"
                    >
                        <X size={24} />
                    </button>

                    <div className="p-6 flex flex-col gap-4">
                        {/* Main Image */}
                        <div className="relative w-full h-96 rounded-xl overflow-hidden">
                            <img
                                src={assets[current]}
                                alt={`report-${current}`}
                                className="w-full h-full object-cover rounded-xl cursor-pointer"
                                onClick={() => setFullscreen(true)}
                            />
                            <div
                                className="absolute bottom-3 right-3 bg-white/70 rounded-full p-1 cursor-pointer"
                                onClick={() => setFullscreen(true)}
                            >
                                <Maximize2 size={18} />
                            </div>
                        </div>

                        {/* Thumbnails with optional remove */}
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
                                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {isEditing && assets.length < 3 && (
                            <label className="flex items-center gap-2 text-sm text-blue-600 cursor-pointer w-fit">
                                <Plus size={16} /> Add Images
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    hidden
                                    onChange={handleImageUpload}
                                />
                            </label>
                        )}

                        {/* Details */}
                        <div className="flex flex-col gap-2">
                            {isEditing ? (
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    className="border rounded-lg p-2 w-full"
                                    rows={3}
                                />
                            ) : (
                                <p className="text-xl font-semibold text-gray-800">{text}</p>
                            )}

                            {isEditing ? (
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="border rounded-lg p-2 text-sm"
                                />
                            ) : (
                                <p className="text-sm text-gray-600">📍 Location: {location}</p>
                            )}

                            <p
                                className={`text-sm font-medium ${report.status === "UNDER_REVIEW" ? "text-yellow-600" : "text-green-600"}`}
                            >
                                Status: {report.status.replace("_", " ")}
                            </p>
                            <p className="text-xs text-gray-500">🕒 Created: {moment(report.createdAt).format("LLL")}</p>
                            <p className="text-xs text-gray-400">Last Updated: {moment(report.updatedAt).fromNow()}</p>
                        </div>

                        {report.status === "UNDER_REVIEW" && (
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200"
                                    onClick={() => console.log("Delete logic here")}
                                >
                                    <Trash2 size={16} className="inline mr-1" /> Delete
                                </button>
                                <button
                                    className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200"
                                    onClick={() => setIsEditing(!isEditing)}
                                >
                                    <Edit3 size={16} className="inline mr-1" /> {isEditing ? "Cancel Edit" : "Edit"}
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Fullscreen Viewer */}
                {fullscreen && (
                    <motion.div
                        className="fixed inset-0 z-50 bg-black flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setFullscreen(false)}
                    >
                        <img
                            src={assets[current]}
                            alt="fullscreen"
                            className="max-w-full max-h-full object-contain"
                        />
                        <button className="absolute top-5 right-5 text-white">
                            <X size={30} />
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>,
        document.body
    );
};
