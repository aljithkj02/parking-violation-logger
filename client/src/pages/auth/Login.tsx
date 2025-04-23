import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLogin } from '../../hooks/auth/useLogin';

export const Login = () => {
    const {
        form,
        handleChange,
        handleLogin,
    } = useLogin();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <motion.div
                className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >

                <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
                    Login
                </h2>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            placeholder="••••••••"
                        />
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition-colors"
                    >
                        Login
                    </motion.button>
                </form>

                <p className="text-sm text-center mt-6 text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-indigo-600 hover:underline font-medium">
                        Signup
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};
