import { Link } from "react-router-dom";

export const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-4">
            <h1 className="text-5xl font-extrabold text-gray-800 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-6">Oops! Page not found.</p>
            <Link
                to="/"
                className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition"
            >
                Go Home
            </Link>
        </div>
    );
};
