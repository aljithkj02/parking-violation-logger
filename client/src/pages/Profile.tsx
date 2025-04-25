import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { logout, setUser as updateUser } from "../store/slices/authSlice";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { uploadFiles } from "../api/upload";
import { updateProfile } from "../api/profile";
import toast from "react-hot-toast";
import { Loader } from "../components/common/Loader";
import { User } from "../utils/auth.type";

const placeholderImg = "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg";

export const Profile = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [profileImg, setProfileImg] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (!storedUser || !storedUser.email) {
            dispatch(logout());
        } else {
            setUser(storedUser);
            setName(storedUser.name);
            setProfileImg(storedUser.profileImg || "");
        }
    }, [dispatch]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            const reader = new FileReader();
            reader.onloadend = () => setProfileImg(reader.result as string);
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSave = async () => {
        try {
            let imageUrl = profileImg;
            setIsLoading(true);
            if (file) {
                const res = await uploadFiles([file]);
                if (res) {
                    imageUrl = res[0];
                } else {
                    console.log("something went wrong while uploading file!")
                    return;
                }
            }

            const res = await updateProfile({ name, profileImg: imageUrl });
            if (res?.status) {
                setUser(res.data);
                localStorage.setItem("user", JSON.stringify(res.data));
                dispatch(updateUser(res.data as User));
            }
            setIsEditing(false);
        } catch (err) {
            toast.error("Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center py-10">
            {user ? (
                <motion.div
                    className="bg-white px-10 py-8 rounded-2xl shadow-2xl space-y-8 w-full max-w-3xl relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex flex-col items-center text-center">
                        <motion.h1
                            className="text-3xl md:text-4xl font-bold text-gray-800"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            Profile Information
                        </motion.h1>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                        {/* Left Section */}
                        <div className="flex flex-col gap-5 text-gray-700 w-full md:w-2/3">
                            <div className="flex items-center gap-3">
                                <span className="font-medium min-w-[70px]">Name:</span>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        className="border rounded-md px-3 py-2 w-full outline-blue-500"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                ) : (
                                    <span className="text-gray-900 font-medium">{user.name}</span>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="font-medium min-w-[70px]">Email:</span>
                                <span className="text-gray-800">{user.email}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="font-medium min-w-[70px]">Role:</span>
                                <span className="text-gray-800 font-semibold capitalize">{user.role}</span>
                            </div>
                        </div>

                        {/* Right Section (Image) */}
                        <div className="relative group w-28 h-28">
                            <img
                                src={profileImg || placeholderImg}
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover border shadow-md"
                            />
                            {isEditing && (
                                <label className="absolute inset-0 bg-black opacity-40 flex items-center justify-center rounded-full cursor-pointer group-hover:opacity-60 transition-opacity">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />

                                    <span className="text-white text-sm">Change</span>
                                </label>
                            )}
                        </div>
                    </div>

                    <motion.button
                        className="cursor-pointer w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-all"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    >
                        {isEditing ? "Save Profile" : "Edit Profile"}
                    </motion.button>

                    { isLoading && <div className="absolute bottom-[40%] left-[45%]">
                        <Loader />
                    </div> }
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
