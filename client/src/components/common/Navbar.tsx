import { Menu, User } from "lucide-react";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";
import { useAppSelector } from "../../hooks/useAppSelector";

interface NavbarProps {
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Navbar = ({ setSidebarOpen }: NavbarProps) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Check if the user info exists in the redux slice or localStorage
    const userFromRedux = useAppSelector((state) => state.auth.user);
    const userName = userFromRedux?.name || JSON.parse(localStorage.getItem("user") || "{}")?.name;

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        dispatch(logout());
        navigate("/login");
    };

    // Handle logout confirmation dialog
    const confirmLogout = () => {
        setIsDialogOpen(false);
        handleLogout();
    };

    return (
        <>
            <nav className="h-16 bg-white shadow fixed top-0 left-0 right-0 z-30 flex items-center justify-between md:justify-end px-4 md:px-6">
                {/* Sidebar toggle button for mobile */}
                <button
                    onClick={() => setSidebarOpen((prev) => !prev)}
                    className="md:hidden text-gray-600 hover:text-black focus:outline-none"
                >
                    <Menu size={24} />
                </button>

                {/* Right side - User Icon and Dropdown */}
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        {/* User icon and dropdown */}
                        <button
                            onClick={() => setIsDropdownOpen((prev) => !prev)}
                            className="flex items-center space-x-2 text-gray-600 hover:text-black focus:outline-none cursor-pointer"
                        >
                            <User size={24} />
                            <span className="hidden md:block">{userName}</span>
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-36 bg-white shadow-md rounded-lg border border-gray-200">
                                <button
                                    onClick={() => setIsDialogOpen(true)}
                                    className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 focus:outline-none cursor-pointer"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Dialog Box for Logout Confirmation */}
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} className="relative z-50">
                <Dialog.Panel className="fixed inset-0 bg-black opacity-50" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <Dialog.Title className="text-lg font-semibold text-gray-800">
                            Confirm Logout
                        </Dialog.Title>
                        <Dialog.Description className="mt-2 text-gray-600">
                            Are you sure you want to log out?
                        </Dialog.Description>
                        <div className="mt-4 flex justify-end space-x-4">
                            <button
                                onClick={() => setIsDialogOpen(false)}
                                className="px-4 py-2 text-sm text-gray-600 border rounded-md hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md"
                            >
                                Logout
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </>
    );
};
