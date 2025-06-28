import React from 'react';
import { Link, NavLink, Outlet } from 'react-router';
import {
    FaHome,
    FaBoxOpen,
    FaMoneyCheckAlt,
    FaUserEdit,
    FaSearchLocation,
    FaUserCheck,
    FaUserClock,
    FaUserShield,
    FaMotorcycle
} from 'react-icons/fa';
import useUserRole from '../hooks/useUserRole';
import logo from '../assets/assets/logo.png';

const DashboardLayout = () => {
    const { role, roleLoading } = useUserRole();
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <div className={`fixed z-30 inset-y-0 left-0 w-64 bg-gray-100 border-r transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
                <div className="flex items-center px-4 py-4 border-b">
                    <Link to="/" className="flex items-center gap-2">
                        <img src={logo} alt="Logo" className="w-10" />
                        <h1 className="text-2xl font-extrabold">Profast</h1>
                    </Link>
                </div>
                <nav className="flex flex-col px-4 py-6 space-y-2 text-gray-800">
                    <NavLink to="/dashboard" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-200">
                        <FaHome /> Home
                    </NavLink>
                    <NavLink to="/dashboard/myParcels" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-200">
                        <FaBoxOpen /> My Parcels
                    </NavLink>
                    <NavLink to="/dashboard/paymentHistory" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-200">
                        <FaMoneyCheckAlt /> Payment History
                    </NavLink>
                    <NavLink to="/dashboard/track" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-200">
                        <FaSearchLocation /> Track a Package
                    </NavLink>

                    {!roleLoading && role === 'admin' && (
                        <>
                            <NavLink to="/dashboard/assign-rider" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-200">
                                <FaMotorcycle /> Assign Rider
                            </NavLink>
                            <NavLink to="/dashboard/active-riders" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-200">
                                <FaUserCheck /> Active Riders
                            </NavLink>
                            <NavLink to="/dashboard/pending-riders" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-200">
                                <FaUserClock /> Pending Riders
                            </NavLink>
                            <NavLink to="/dashboard/makeAdmin" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-200">
                                <FaUserShield /> Make Admin
                            </NavLink>
                        </>
                    )}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Topbar for mobile */}
                <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b bg-white shadow-md">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-gray-600 focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h2 className="text-xl font-bold">Dashboard</h2>
                    <div></div> {/* Empty div for alignment */}
                </div>

                {/* Outlet Content */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
