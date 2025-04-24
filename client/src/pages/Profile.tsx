import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { logout } from "../store/slices/authSlice"; // Make sure this action is correctly imported
import { useAppDispatch } from "../hooks/useAppDispatch";

export const Profile = () => {
    const [user, setUser] = useState<any>(null);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

        if (!storedUser || !storedUser.email) {
            dispatch(logout());
        } else {
            setUser(storedUser);
        }
    }, [dispatch]);

    return (
        <div>
            {user ? (
                <motion.div
                    className="p-8 rounded-lg shadow-xl space-y-6 flex flex-col items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div
                        className="flex flex-col items-center text-center space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <motion.h1
                            className="text-4xl font-semibold text-gray-800"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            Profile Information
                        </motion.h1>
                    </motion.div>

                    <div className="space-y-6 w-full">
                        <div className="flex items-center gap-2 text-gray-700">
                            <span className="font-medium">Name:</span>
                            <span className="text-gray-800">{user.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                            <span className="font-medium">Email:</span>
                            <span className="text-gray-800">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                            <span className="font-medium">Role:</span>
                            <span className="text-gray-800 font-semibold">{user.role}</span>
                        </div>
                    </div>

                    <motion.button
                        className="cursor-pointer w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-101"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        Edit Profile
                    </motion.button>
                </motion.div>
            ) : (
                <motion.div
                    className="bg-white p-8 rounded-lg shadow-xl w-full max-w-xl flex justify-center items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <p className="text-center text-lg text-gray-600">
                        No user data found. You are being logged out.
                    </p>
                </motion.div>
            )}
        </div>
    );
};
