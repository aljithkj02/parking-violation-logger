import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/auth/Login';
import { Signup } from '../pages/auth/Signup';
import { Home } from '../pages/Home';
import { Reports } from '../pages/Reports';


const AppRouter = () => {
    const isAuthenticated = false; // Replace with auth logic
    const isAdmin = false; // Replace with role from Redux

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home />} />
            <Route
                path="/reports"
                element={isAuthenticated ? <Reports /> : <Navigate to="/login" />}
            />
        </Routes>
    );
};

export default AppRouter;
