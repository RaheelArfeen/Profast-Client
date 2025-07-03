import React, { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router';
import {
    deleteUser,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
} from 'firebase/auth';
import { auth } from '../Firebase/firebase.init';
import { toast } from 'sonner';
import axios from 'axios';
import { motion } from 'framer-motion';
import logo from '../assets/assets/logo.png';
import authImg from '../assets/assets/authImage.png';

const fadeVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.4,
        },
    }),
};

const SignIn = ({ onRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState('user'); // store role here if you want

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const validateForm = () => {
        const newErrors = {};
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!password) {
            newErrors.password = 'Password is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const sendUserToBackend = async (user) => {
        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            lastSignInTime: user.metadata?.lastSignInTime || '',
            role: 'user',
        };
        try {
            const existingUser = await axios.get(`https://profast-server.onrender.com/users/${user.email}`);
            if (existingUser.status === 200 && existingUser.data?.email === user.email) return true;
        } catch {
            try {
                const res = await axios.post('https://profast-server.onrender.com/users', userData);
                if (res.status === 200 || res.status === 201) return true;
                throw new Error('Backend rejected user');
            } catch {
                await deleteUser(user);
                throw new Error('Something went wrong while setting up your account. Please try again.');
            }
        }
    };

    // NEW helper: call backend login and fetch role
    const backendLoginAndFetchRole = async (email) => {
        try {
            await axios.post(
                'https://profast-server.onrender.com/login',
                { email },
                { withCredentials: true }
            );

            const roleRes = await axios.get(`https://profast-server.onrender.com/role/${email}`);
            const fetchedRole = roleRes.data.role || 'user';
            setRole(fetchedRole);
        } catch (error) {
            console.error('Backend login or role fetch failed:', error);
            setRole('user');
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            await sendUserToBackend(user);

            // Call backend login + fetch role
            await backendLoginAndFetchRole(user.email);

            toast.success('Successfully logged in with Google');
            navigate(from, { replace: true });
        } catch (error) {
            toast.error(error.message || 'Google login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!email) {
            setErrors({ email: 'Please enter your email to reset password' });
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success('Password reset email sent. Check your inbox.');
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                setErrors({ email: 'No user found with this email' });
            } else {
                toast.error('Failed to send reset email. Please try again.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            const user = result.user;

            await sendUserToBackend(user);

            // Update lastSignInTime
            await axios.patch('https://profast-server.onrender.com/users', {
                email,
                lastSignInTime: user.metadata?.lastSignInTime,
            });

            // Call backend login + fetch role
            await backendLoginAndFetchRole(email);

            toast.success('Successfully logged in.');
            navigate(from, { replace: true });
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                setErrors({ email: 'No user found with this email' });
                toast.error('No user found with this email');
            } else if (error.code === 'auth/wrong-password') {
                setErrors({ password: 'Incorrect password' });
                toast.error('Incorrect password');
            } else {
                toast.error(error.message || 'Failed to sign in. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-white">
            {/* Left Side */}
            <motion.div
                initial={{ x: -60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="flex-1 flex items-center justify-center px-6 md:px-12 py-10 relative"
            >
                {/* Logo */}
                <motion.div
                    className="flex items-center gap-2 absolute top-5 md:left-8 left-6 cursor-pointer"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => navigate('/')}
                >
                    <motion.img src={logo} alt="Logo" className="w-10" />
                    <motion.h1 className="urbanist text-2xl lg:text-3xl font-extrabold relative top-4 right-6.5">
                        Profast
                    </motion.h1>
                </motion.div>

                {/* Form Container */}
                <motion.div
                    className="relative w-full max-w-md"
                    initial="hidden"
                    animate="visible"
                    variants={fadeVariant}
                >
                    {/* Header */}
                    <motion.div variants={fadeVariant} custom={0}>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                        <p className="text-gray-600">Login with Profast</p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                        {/* Email */}
                        <motion.div variants={fadeVariant} custom={1}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                required
                                className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-green-500'
                                    } transition`}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </motion.div>

                        {/* Password */}
                        <motion.div variants={fadeVariant} custom={2}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    required
                                    className={`w-full px-4 py-3 pr-12 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-green-500'
                                        } transition`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </motion.div>

                        {/* Reset Password */}
                        <motion.div variants={fadeVariant} custom={3} className="text-left">
                            <button
                                type="button"
                                onClick={handleResetPassword}
                                className="text-sm text-green-600 hover:text-green-700 font-medium"
                            >
                                Forget Password?
                            </button>
                        </motion.div>

                        {/* Login Button */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            variants={fadeVariant}
                            custom={4}
                            className={`w-full ${loading ? 'bg-green-400' : 'bg-green-500 hover:bg-green-600'
                                } text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200`}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </motion.button>

                        {/* Register Redirect */}
                        <motion.div className="text-center" variants={fadeVariant} custom={5}>
                            <span className="text-gray-600">Don't have an account? </span>
                            <Link
                                to="/signUp"
                                onClick={onRegister}
                                className="text-green-600 hover:text-green-700 font-medium"
                            >
                                Register
                            </Link>
                        </motion.div>

                        {/* Divider */}
                        <motion.div className="relative my-8" variants={fadeVariant} custom={6}>
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-4 text-gray-500">Or</span>
                            </div>
                        </motion.div>

                        {/* Google Login */}
                        <motion.button
                            type="button"
                            onClick={handleGoogleLogin}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            variants={fadeVariant}
                            custom={7}
                            className={`w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-4 px-6 rounded-lg flex items-center justify-center space-x-3 border border-gray-300 ${loading ? 'opacity-70' : ''
                                }`}
                        >
                            <svg
                                width="21"
                                height="20"
                                viewBox="0 0 21 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g clipPath="url(#clip0)">
                                    <path d="M20.5 10.23c0-.68-.06-1.36-.18-2.03H10.7v3.85h5.51c-.23 1.24-.96 2.34-2.04 3.04v2.5h3.29c1.93-1.74 3.04-4.31 3.04-7.36z" fill="#1C71FF" />
                                    <path d="M10.7 20c2.75 0 5.07-.89 6.76-2.41l-3.29-2.5c-.91.6-2.09.95-3.47.95-2.66 0-4.91-1.76-5.72-4.14H1.58v2.58C3.31 17.87 6.84 20 10.7 20z" fill="#34A853" />
                                    <path d="M4.97 11.92A6.992 6.992 0 014.97 8.09V5.51H1.58A10.01 10.01 0 000.5 10c0 1.77.44 3.44 1.58 4.49l3.39-2.57z" fill="#FBBC04" />
                                    <path d="M10.7 3.96c1.45-.02 2.86.53 3.91 1.5l2.91-2.86C15.68.9 13.23-.03 10.7 0 6.84 0 3.31 2.13 1.58 5.51l3.39 2.58C5.78 5.72 8.04 3.96 10.7 3.96z" fill="#EA4335" />
                                </g>
                                <defs>
                                    <clipPath id="clip0">
                                        <rect width="20" height="20" fill="white" transform="translate(0.5)" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <span>{loading ? 'Logging in...' : 'Login with Google'}</span>
                        </motion.button>
                    </form>
                </motion.div>
            </motion.div>

            {/* Right Side Illustration */}
            <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="hidden lg:flex flex-1 items-center justify-center bg-[#FAFDF0] relative overflow-hidden"
            >
                <motion.img
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    src={authImg}
                    className="w-[36rem] xl:w-[50rem]"
                    alt="Auth Illustration"
                />
            </motion.div>
        </div>
    );
};

export default SignIn;
