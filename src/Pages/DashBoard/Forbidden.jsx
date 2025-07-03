import { FaLock } from "react-icons/fa";
import { Link } from "react-router"; // fix import, react-router-dom is correct

const Forbidden = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
            <FaLock className="text-7xl text-red-600 mb-6" />
            <h1 className="text-5xl font-extrabold text-red-700">403 - Forbidden</h1>
            <p className="mt-4 max-w-xl text-gray-700 text-lg">
                Sorry, you do not have permission to access this page. Please contact an administrator if you believe this is a mistake.
            </p>

            <Link to="/" className="mt-8 inline-block">
                <button
                    type="button"
                    className="bg-red-600 hover:bg-red-700 transition-colors duration-300 text-white font-semibold py-3 px-8 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                    Go to Home
                </button>
            </Link>
        </div>
    );
};

export default Forbidden;
