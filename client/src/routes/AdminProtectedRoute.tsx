import { Navigate, Outlet } from "react-router-dom";

export const AdminProtectedRoute = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}'); 

    if (!user || user.role !== "ADMIN") {
        return <Navigate to="/reports" replace />;
    }

    return <Outlet />;
};
