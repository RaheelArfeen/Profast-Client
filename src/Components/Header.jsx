import React, { useState, useContext } from 'react';
import logo from '../assets/assets/logo.png';
import { Link, NavLink, useNavigate } from 'react-router';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../Provider/AuthProvider';
import { toast } from 'sonner';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { user, logOut, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logOut();
            toast.success('Logged out successfully.');
        } catch (error) {
            toast.error('Failed to logout. Please try again.');
            console.error('Logout error:', error);
        }
    };

    const navItemVariant = {
        hidden: { opacity: 0, y: -10 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1 },
        }),
        hover: {
            scale: 1.1,
            transition: { duration: 0.2 },
        },
    };

    const mobileLinkVariant = {
        hidden: { opacity: 0, x: -20 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: { delay: i * 0.05 },
        }),
    };

    const buttonVariant = {
        hidden: { opacity: 0, y: 10 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.2 },
        }),
    };

    const links = (
        <>
            {['/', '/addParcel', '/coverage', '/beArider', '/dashboard'].map((path, i) => {
                const label = {
                    '/': 'Home',
                    '/addParcel': 'Add Parcel',
                    '/coverage': 'Coverage',
                    '/beArider': 'Be A Rider',
                    '/dashboard': 'Dashboard',
                }[path];

                return (
                    <motion.div
                        key={path}
                        custom={i}
                        variants={isOpen ? mobileLinkVariant : navItemVariant}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        onClick={() => setIsOpen(false)}
                    >
                        <NavLink
                            to={path}
                            className={({ isActive }) =>
                                `capitalize inline-block px-3 py-2 rounded-full transition-all duration-300 ${isActive
                                    ? 'bg-[#C8ED63] text-[#1F1F1F]'
                                    : 'text-[#1F1F1F] hover:bg-gray-100'}`
                            }
                        >
                            {label}
                        </NavLink>
                    </motion.div>
                );
            })}
        </>
    );

    return (
        <div className="max-w-[1800px] w-full mx-auto py-4 px-2 md:px-6 lg:px-12">
            <div className="bg-white w-full py-4 px-6 lg:px-8 rounded-2xl flex items-center justify-between relative">
                {/* Logo */}
                <Link to={'/'}>
                    <motion.div
                        className="flex items-center gap-2 cursor-pointer"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <img src={logo} alt="Logo" className="w-10" />
                        <h1 className="urbanist text-2xl lg:text-3xl relative top-3 right-7 font-extrabold">
                            Profast
                        </h1>
                    </motion.div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden xl:flex items-center gap-10 text-[#1F1F1F] font-semibold">
                    {links}
                </div>

                {/* Right Side Buttons */}
                <div className="hidden xl:flex items-center gap-3 urbanist relative">
                    {!loading && (
                        !user ? (
                            <div className="flex gap-2">
                                <motion.button
                                    custom={0}
                                    variants={buttonVariant}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover={{
                                        scale: 1.05,
                                        backgroundColor: '#f0f0f0',
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    className="py-2 px-6 font-bold rounded-xl border-2 border-[#DADADA] text-[#606060]"
                                    onClick={() => navigate('/signIn')}
                                >
                                    Sign In
                                </motion.button>

                                <motion.button
                                    custom={1}
                                    variants={buttonVariant}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover={{
                                        scale: 1.1,
                                        backgroundColor: '#b8ce75',
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    className="py-2 px-6 font-bold rounded-xl bg-[#CAEB66] text-[#1F1F1F]"
                                    onClick={() => navigate('/signUp')}
                                >
                                    Sign Up
                                </motion.button>
                            </div>
                        ) : (
                            <div className="relative">
                                <motion.img
                                    src={user.photoURL}
                                    alt="User"
                                    className="w-10 h-10 rounded-full object-cover border-2 border-[#b8ce75] cursor-pointer"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, ease: 'easeOut' }}
                                    whileHover={{ scale: 1.1 }}
                                />

                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            transition={{ duration: 0.25 }}
                                            className="absolute right-0 w-60 bg-white border border-[#E0E0E0] shadow-xl rounded-xl mt-2 z-50 text-sm"
                                        >
                                            <motion.div
                                                className="py-3 px-4 border-b border-[#E0E0E0]"
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1, duration: 0.3 }}
                                            >
                                                <p className="text-[#606060] font-medium">Signed in as:</p>
                                                <p className="text-[#1F1F1F] font-semibold break-all">{user.email}</p>
                                            </motion.div>

                                            <Link
                                                to="/profile"
                                                onClick={() => setDropdownOpen(false)}
                                                className="block px-4 py-2 text-[#1F1F1F] hover:bg-[#f6f9ef] hover:text-[#2f3e16] transition"
                                            >
                                                Profile
                                            </Link>

                                            <Link
                                                to="/dashboard"
                                                onClick={() => setDropdownOpen(false)}
                                                className="block px-4 py-2 text-[#1F1F1F] hover:bg-[#f6f9ef] hover:text-[#2f3e16] transition"
                                            >
                                                Dashboard
                                            </Link>

                                            <button onClick={handleLogout} className="block px-4 py-2 text-[#1F1F1F] hover:bg-[#fffafa] hover:text-[#2f3e16] transition w-full text-left rounded-b-lg">
                                                Log Out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )
                    )}
                </div>

                {/* Mobile Menu Icon */}
                <motion.div
                    className="xl:hidden"
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                >
                    <button onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </motion.div>
            </div>

            {/* Mobile Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="bg-white rounded-xl shadow-md mt-2 px-6 py-4 xl:hidden flex flex-col gap-4 text-[#1F1F1F] font-semibold overflow-hidden"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {links}

                        <div className="flex flex-col gap-2 mt-4 urbanist">
                            {!loading && (
                                !user ? (
                                    <div>
                                        <motion.button
                                            custom={0}
                                            variants={buttonVariant}
                                            initial="hidden"
                                            animate="visible"
                                            whileHover={{
                                                scale: 1.03,
                                                backgroundColor: '#f0f0f0',
                                            }}
                                            whileTap={{ scale: 0.95 }}
                                            className="py-2 px-4 font-bold rounded-xl border-2 border-[#DADADA] text-[#606060]"
                                            onClick={() => {
                                                setIsOpen(false);
                                                navigate('/signIn');
                                            }}
                                        >
                                            Sign In
                                        </motion.button>
                                        <motion.button
                                            custom={1}
                                            variants={buttonVariant}
                                            initial="hidden"
                                            animate="visible"
                                            whileHover={{
                                                scale: 1.05,
                                                backgroundColor: '#b8ce75',
                                            }}
                                            whileTap={{ scale: 0.95 }}
                                            className="py-2 px-4 font-bold rounded-xl bg-[#CAEB66] text-[#1F1F1F]"
                                            onClick={() => {
                                                setIsOpen(false);
                                                navigate('/signUp');
                                            }}
                                        >
                                            Sign Up
                                        </motion.button>
                                    </div>
                                ) : (
                                    <motion.div
                                        className="w-full flex flex-col gap-3"
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="border-t border-gray-200 pt-4">
                                            <div
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    navigate('/profile');
                                                }}
                                                className="flex items-center cursor-pointer"
                                            >
                                                <div className="rounded-full h-9 w-9 overflow-hidden border border-gray-300">
                                                    {user.photoURL ? (
                                                        <motion.img
                                                            src={user.photoURL}
                                                            alt={user.displayName}
                                                            className="h-full w-full object-cover"
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ duration: 0.4, ease: 'easeOut' }}
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg">
                                                            {user.displayName
                                                                ? user.displayName.charAt(0).toUpperCase()
                                                                : 'U'}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-start ml-3">
                                                    <div className="text-sm font-medium text-gray-800">{user.displayName || 'User'}</div>
                                                    <div className="text-sm text-gray-600">Email: {user.email}</div>
                                                </div>
                                            </div>
                                            <button onClick={handleLogout} className="w-full text-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 mt-2 rounded-lg transition-colors duration-300">Log Out</button>
                                        </div>
                                    </motion.div>
                                )
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Header;