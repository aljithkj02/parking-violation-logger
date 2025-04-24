import { NavLink } from "react-router-dom";

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}'); 

    const isAdmin = user.role === "ADMIN";

    const links = [
        ...(isAdmin ? [{ name: "Dashboard", to: "/dashboard"}]: []),
        ...(isAdmin ? []: [{ name: "Home", to: "/"}]),
        { name: isAdmin ? "Reports": "My Reports", to: "/reports" },
        { name: "Profile", to: "/profile"},
    ];
    

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-40 z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside
                className={`fixed md:static top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                    }`}
            >
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-indigo-600 mb-6">Logo</h2>
                    <nav className="space-y-2">
                        {links.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) =>
                                    `block px-4 py-2 rounded-lg font-medium transition ${isActive
                                        ? "bg-indigo-100 text-indigo-700"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`
                                }
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </aside>
        </>
    );
};
