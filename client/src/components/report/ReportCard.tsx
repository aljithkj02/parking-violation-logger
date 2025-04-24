import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Report } from "../../utils/report.type";

interface Props {
    report: Report;
}

export const ReportCard = ({ report }: Props) => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (report.assets.length <= 1) return;

        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % report.assets.length);
        }, 2000);

        return () => clearInterval(interval);
    }, [report.assets]);

    return (
        <motion.div
            className="cursor-pointer relative bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-5 flex flex-col gap-3 overflow-hidden border border-gray-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Carousel */}
            <div className="w-full h-52 relative overflow-hidden rounded-xl shadow-sm">
                {report.assets.map((img, i) => (
                    <motion.img
                        key={i}
                        src={img}
                        alt={`asset-${i}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 rounded-xl ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"
                            }`}
                    />
                ))}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-1 mt-2">
                <p className="text-gray-800 text-sm font-medium line-clamp-3">{report.text}</p>
                <p className="text-gray-500 text-xs">📍 {report.location}</p>
                <p
                    className={`text-xs font-semibold ${report.status === "UNDER_REVIEW" ? "text-yellow-600" : "text-green-600"
                        }`}
                >
                    {report.status.replace("_", " ")}
                </p>
            </div>
        </motion.div>
    );
};
