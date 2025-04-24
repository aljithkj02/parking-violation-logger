import { Navigate, Outlet } from "react-router-dom";
import { FloatingReportButton } from "../components/report/FloatingReportButton";

export const ProtectedRoute = () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem('user') || '{}'); 

    const isAdmin = user.role === "ADMIN";

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            <Outlet />
            { !isAdmin && <FloatingReportButton /> }
        </>
    )
};
