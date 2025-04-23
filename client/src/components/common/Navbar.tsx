import { Menu } from "lucide-react";

interface NavbarProps {
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Navbar = ({ setSidebarOpen }: NavbarProps) => {
    return (
        <nav className="h-16 bg-white shadow fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 md:px-6">
            {/* Sidebar toggle button for mobile */}
            <button
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="md:hidden text-gray-600 hover:text-black focus:outline-none"
            >
                <Menu size={24} />
            </button>

            {/* App title */}
            <h1 className="text-xl font-bold text-gray-800">My Dashboard</h1>

            {/* Right side */}
            <div className="hidden md:block text-sm text-gray-600">
                Welcome
            </div>
        </nav>
    );
};
