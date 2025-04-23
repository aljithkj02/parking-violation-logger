import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const PublicRoute = () => {
    const tokenFromRedux = useSelector((state: any) => state.auth.token);
    const tokenFromStorage = localStorage.getItem("token");

    const isAuthenticated = tokenFromRedux || tokenFromStorage;

    return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};
