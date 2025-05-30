import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AuthMode } from '../../utils/types';
import { useSignup } from '../../hooks/auth/useSignup';

export const Signup = () => {
    const {
        authMode,
        form,
        handleChange,
        handleSubmit,
        setAuthMode
    } = useSignup();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <motion.div
                className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                {/* Auth mode switch */}
                <div className="flex justify-between mb-6">
                    {(['user', 'admin'] as AuthMode[]).map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setAuthMode(mode)}
                            className={`flex-1 py-2 mx-1 rounded-full font-medium transition-all duration-200 ${authMode === mode
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-200 text-gray-700'
                                }`}
                        >
                            {mode === 'user' ? 'User Mode' : 'Admin Mode'}
                        </button>
                    ))}
                </div>

                <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
                    {authMode === 'admin' ? 'Admin Signup' : 'User Signup'}
                </h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            placeholder="Your name"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
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
                            name="password"
                            type="password"
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
                        Signup
                    </motion.button>
                </form>

                <p className="text-sm text-center mt-6 text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-600 hover:underline font-medium">
                        Login
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};
