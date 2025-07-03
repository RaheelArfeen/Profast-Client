import React from 'react';
import { Link, NavLink, Outlet } from 'react-router';
import {
    FaHome,
    FaBoxOpen,
    FaMoneyCheckAlt,
    FaSearchLocation,
    FaUserCheck,
    FaUserClock,
    FaUserShield,
    FaMotorcycle,
    FaTasks,
    FaCheckCircle,
    FaWallet
} from 'react-icons/fa';
import useUserRole from '../hooks/useUserRole';
import logo from '../assets/assets/logo.png';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
        },
    },
};

const slideUpFade = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const DashboardLayout = () => {
    const { role, roleLoading } = useUserRole();
    const [isOpen, setIsOpen] = React.useState(false);

    const [isLargeScreen, setIsLargeScreen] = React.useState(window.innerWidth >= 1024);
    React.useEffect(() => {
        const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <AnimatePresence>
                {(isOpen || isLargeScreen) && (
                    <motion.nav
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={slideUpFade}
                        className="fixed z-30 inset-y-0 left-0 w-64 bg-gray-100 border-r lg:static lg:inset-0"
                    >
                        <motion.div
                            className="flex items-center px-4 py-4 border-b"
                            variants={slideUpFade}
                            initial="hidden"
                            animate="visible"
                        >
                            <Link to="/" className="flex items-center gap-2">
                                <img src={logo} alt="Logo" className="w-10" />
                                <h1 className="text-2xl font-extrabold relative top-3 right-7">Profast</h1>
                            </Link>
                        </motion.div>

                        {/* Nav container with stagger */}
                        <motion.nav
                            className="flex flex-col px-4 py-6 space-y-2 text-gray-800"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {[
                                { to: "/dashboard", icon: <FaHome />, label: "Home" },
                                { to: "/dashboard/myParcels", icon: <FaBoxOpen />, label: "My Parcels" },
                                { to: "/dashboard/paymentHistory", icon: <FaMoneyCheckAlt />, label: "Payment History" },
                                { to: "/dashboard/track", icon: <FaSearchLocation />, label: "Track a Package" },
                            ].map(({ to, icon, label }) => (
                                <NavLink
                                    key={to}
                                    to={to}
                                    className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-200"
                                >
                                    {({ isActive }) => (
                                        <motion.div
                                            variants={slideUpFade}
                                            style={{ fontWeight: isActive ? 'bold' : 'normal' }}
                                            className="flex items-center gap-2 w-full"
                                        >
                                            {icon} {label}
                                        </motion.div>
                                    )}
                                </NavLink>
                            ))}

                            {!roleLoading && role === 'rider' && (
                                <>
                                    {[
                                        { to: "/dashboard/pending-deliveries", icon: <FaMotorcycle />, label: "Pending Deliveries" },
                                        { to: "/dashboard/complete-deleveries", icon: <FaUserCheck />, label: "Completed Deliveries" },
                                        { to: "/dashboard/my-earning", icon: <FaUserClock />, label: "My Earning" },
                                    ].map(({ to, icon, label }) => (
                                        <NavLink
                                            key={to}
                                            to={to}
                                            className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-200"
                                        >
                                            {({ isActive }) => (
                                                <motion.div
                                                    variants={slideUpFade}
                                                    style={{ fontWeight: isActive ? 'bold' : 'normal' }}
                                                    className="flex items-center gap-2 w-full"
                                                >
                                                    {icon} {label}
                                                </motion.div>
                                            )}
                                        </NavLink>
                                    ))}
                                </>
                            )}

                            {!roleLoading && role === 'admin' && (
                                <>
                                    {[
                                        { to: "/dashboard/assign-rider", icon: <FaMotorcycle />, label: "Assign Rider" },
                                        { to: "/dashboard/active-riders", icon: <FaUserCheck />, label: "Active Riders" },
                                        { to: "/dashboard/pending-riders", icon: <FaUserClock />, label: "Pending Riders" },
                                        { to: "/dashboard/makeAdmin", icon: <FaUserShield />, label: "Make Admin" },
                                    ].map(({ to, icon, label }) => (
                                        <NavLink
                                            key={to}
                                            to={to}
                                            className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-200"
                                        >
                                            {({ isActive }) => (
                                                <motion.div
                                                    variants={slideUpFade}
                                                    style={{ fontWeight: isActive ? 'bold' : 'normal' }}
                                                    className="flex items-center gap-2 w-full"
                                                >
                                                    {icon} {label}
                                                </motion.div>
                                            )}
                                        </NavLink>
                                    ))}
                                </>
                            )}
                        </motion.nav>
                    </motion.nav>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Topbar for mobile */}
                <motion.div
                    className="lg:hidden flex items-center justify-between px-4 py-3 border-b bg-white shadow-md"
                    initial="hidden"
                    animate="visible"
                    variants={slideUpFade}
                >
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-gray-600 focus:outline-none"
                        aria-label="Toggle sidebar"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h2 className="text-xl font-bold">Dashboard</h2>
                    <div></div> {/* Empty div for alignment */}
                </motion.div>

                {/* Outlet Content */}
                <motion.div
                    className="flex-1 overflow-y-auto p-4 bg-gray-50"
                    initial="hidden"
                    animate="visible"
                    variants={slideUpFade}
                >
                    <Outlet />
                </motion.div>
            </div>
        </div>
    );
};

export default DashboardLayout;
