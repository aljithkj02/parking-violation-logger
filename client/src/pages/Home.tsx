import { motion } from "framer-motion";
import Parking from "../assets/parking.jpg";

export const Home = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative w-full h-[70vh] md:h-[85vh] rounded-xl overflow-hidden"
        >
            {/* Background Image */}
            <motion.img
                src={Parking}
                alt="Citizen Reporting"
                initial={{ scale: 1.05, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 w-full h-full object-cover object-center"
            />

            {/* Overlay with gradient and text */}
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4 md:px-8">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4"
                >
                    Empowering Citizens for a Better City
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="text-gray-200 text-sm sm:text-base md:text-lg max-w-2xl mb-4 font-medium shadow-lg"
                >
                    Report vehicles parked in restricted areas by submitting photos.
                    Your evidence helps build a safer, more organized city.
                </motion.p>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-gray-300 text-xs sm:text-sm md:text-base shadow-lg font-medium"
                >
                    Together, we can make a difference.
                </motion.p>

            </div>
        </motion.div>
    );
};
