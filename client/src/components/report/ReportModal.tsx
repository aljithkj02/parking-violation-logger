import { useState } from "react";
import { createPortal } from "react-dom";
import { Report } from "../../api/report";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2 } from "lucide-react";
import moment from "moment";

interface Props {
    report: Report;
    onClose: () => void;
}

export const ReportModal = ({ report, onClose }: Props) => {
    const [current, setCurrent] = useState(0);
    const [fullscreen, setFullscreen] = useState(false);

    return createPortal(
        <AnimatePresence>
            {/* Modal backdrop */}
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
                                src={report.assets[current]}
                                alt={`report-${current}`}
                                className="w-full h-full object-cover rounded-xl cursor-pointer"
                                onClick={() => setFullscreen(true)}
                            />
                            <div className="absolute bottom-3 right-3 bg-white/70 rounded-full p-1 cursor-pointer"
                                onClick={() => setFullscreen(true)}
                            >
                                <Maximize2 size={18} />
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {report.assets.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto">
                                {report.assets.map((thumb, i) => (
                                    <img
                                        key={i}
                                        src={thumb}
                                        alt={`thumb-${i}`}
                                        className={`w-20 h-16 object-cover rounded-md border-2 ${i === current ? "border-blue-500" : "border-transparent"} cursor-pointer`}
                                        onClick={() => setCurrent(i)}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Details */}
                        <div className="flex flex-col gap-2">
                            <p className="text-xl font-semibold text-gray-800">{report.text}</p>
                            <p className="text-sm text-gray-600">📍 Location: {report.location}</p>
                            <p
                                className={`text-sm font-medium ${report.status === "UNDER_REVIEW" ? "text-yellow-600" : "text-green-600"
                                    }`}
                            >
                                Status: {report.status.replace("_", " ")}
                            </p>
                            <p className="text-xs text-gray-500">🕒 Created: {moment(report.createdAt).format("LLL")}</p>
                            <p className="text-xs text-gray-400">Last Updated: {moment(report.updatedAt).fromNow()}</p>
                        </div>
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
                            src={report.assets[current]}
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
