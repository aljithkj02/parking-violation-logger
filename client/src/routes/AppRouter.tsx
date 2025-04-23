import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Login } from '../pages/auth/Login';
import { Signup } from '../pages/auth/Signup';
import { Reports } from '../pages/Reports';
import { ProtectedRoute } from './ProtectedRoute';
import { Dashboard } from '../pages/Dashboard';
import { Profile } from '../pages/Profile';
import { Layout } from '../layouts/Layout';
import { Home } from '../pages/Home';
import { AdminProtectedRoute } from './AdminProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { NotFound } from '../pages/NotFound';


const AppRouter = () => {

    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                </Route>

                {/* Protected routes with layout */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/profile" element={<Profile />} />


                        {/* Admin-only route */}
                        <Route element={<AdminProtectedRoute />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                        </Route>u
                    </Route>
                </Route>

                {/* Fallback */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
