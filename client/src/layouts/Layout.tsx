import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/common/Navbar";
import { Sidebar } from "../components/common/Sidebar";

export const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/* Main content */}
            <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
                <Navbar setSidebarOpen={setSidebarOpen} />
                <main className="p-4 sm:p-6 flex-1 overflow-y-auto mt-14">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
