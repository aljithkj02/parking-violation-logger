import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Login } from '../pages/auth/Login';
import { Signup } from '../pages/auth/Signup';
import { Reports } from '../pages/Reports';
import { ProtectedRoute } from './ProtectedRoute';
import { Dashboard } from '../pages/Dashboard';
import { Profile } from '../pages/Profile';
import { Layout } from '../layouts/Layout';


const AppRouter = () => {

    return (

        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected routes with layout */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
