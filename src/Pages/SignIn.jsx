import React, { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router';
import {
    deleteUser,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup
} from 'firebase/auth';
import { auth } from '../Firebase/Firebase.init';
import { toast } from 'sonner';
import axios from 'axios';
import { motion } from 'framer-motion';
import logo from '../assets/assets/logo.png';
import authImg from '../assets/assets/authImage.png';

const Login = ({ onRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
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
        };
        try {
            const existingUser = await axios.get(`http://localhost:3000/users/${user.email}`);
            if (existingUser.status === 200 && existingUser.data?.email === user.email) return true;
        } catch {
            try {
                const res = await axios.post('http://localhost:3000/users', userData);
                if (res.status === 200 || res.status === 201) return true;
                throw new Error('Backend rejected user');
            } catch {
                await deleteUser(user);
                throw new Error('Something went wrong while setting up your account. Please try again.');
            }
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            await sendUserToBackend(user);
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
            await axios.patch('http://localhost:3000/users', {
                email,
                lastSignInTime: user.metadata?.lastSignInTime,
            });
            toast.success('Successfully logged in.');
            navigate(from, { replace: true });
        } catch (error) {
            setLoading(false);
            if (error.code === 'auth/user-not-found') {
                setErrors({ email: 'No user found with this email' });
                toast.error('No user found with this email');
            } else if (error.code === 'auth/wrong-password') {
                setErrors({ password: 'Incorrect password' });
                toast.error('Incorrect password');
            } else {
                toast.error(error.message || 'Failed to sign in. Please try again.');
            }
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
                <div onClick={() => navigate('/')} className="flex items-center gap-2 absolute top-5 md:left-8 left-6 cursor-pointer">
                    <motion.img
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        src={logo}
                        alt="Logo"
                        className="w-10"
                    />
                    <motion.h1
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="urbanist text-2xl lg:text-3xl font-extrabold relative top-4 right-6.5"
                    >
                        Profast
                    </motion.h1>
                </div>

                <div className="relative w-full max-w-md">
                    <div className="mb-8 mt-16 lg:mt-0">
                        <motion.h1
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-3xl font-bold text-gray-900 mb-2"
                        >
                            Welcome Back
                        </motion.h1>
                        <p className="text-gray-600">Login with Profast</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                required
                                className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-green-500'} transition`}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </motion.div>

                        {/* Password */}
                        <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    required
                                    className={`w-full px-4 py-3 pr-12 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-green-500'} transition`}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 text-gray-400 hover:text-gray-600">
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </motion.div>

                        <div className="text-left">
                            <button type="button" onClick={handleResetPassword} className="text-sm text-green-600 hover:text-green-700 font-medium">
                                Forget Password?
                            </button>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            type="submit"
                            disabled={loading}
                            className={`w-full ${loading ? 'bg-green-400' : 'bg-green-500 hover:bg-green-600'} text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200`}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </motion.button>

                        <div className="text-center">
                            <span className="text-gray-600">Don't have an account? </span>
                            <Link to="/register" onClick={onRegister} className="text-green-600 hover:text-green-700 font-medium">
                                Register
                            </Link>
                        </div>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-4 text-gray-500">Or</span>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            type="button"
                            onClick={handleGoogleLogin}
                            className={`w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-4 px-6 rounded-lg flex items-center justify-center space-x-3 border border-gray-300 ${loading ? 'opacity-70' : ''}`}
                        >
                            <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_2074_587)">
                                    <path d="M20.5002 10.2297C20.5002 9.54989 20.444 8.86644 20.324 8.19769H10.7008V12.0485H16.2115C15.9829 13.2905 15.2481 14.3891 14.1722 15.0873V17.5859H17.4599C19.3905 15.8442 20.5002 13.2721 20.5002 10.2297Z" fill="#1C71FF" />
                                    <path d="M10.7006 19.9999C13.4523 19.9999 15.7728 19.1143 17.4635 17.5857L14.1758 15.0871C13.2611 15.6971 12.0802 16.0425 10.7044 16.0425C8.04273 16.0425 5.78593 14.2824 4.97619 11.9161H1.5835V14.4919C3.31546 17.8687 6.8431 19.9999 10.7006 19.9999Z" fill="#34A853" />
                                    <path d="M4.97264 11.9162C4.54527 10.6742 4.54527 9.3294 4.97264 8.08744V5.51166H1.5837C0.136651 8.3373 0.136651 11.6663 1.5837 14.492L4.97264 11.9162Z" fill="#FBBC04" />
                                    <path d="M10.7006 3.95732C12.1552 3.93527 13.561 4.47174 14.6144 5.45649L17.5273 2.60145C15.6828 0.903854 13.2349 -0.0294541 10.7006 -5.85339e-05C6.8431 -5.85339e-05 3.31546 2.13112 1.5835 5.5116L4.97244 8.08739C5.77844 5.71737 8.03898 3.95732 10.7006 3.95732Z" fill="#EA4335" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_2074_587">
                                        <rect width="20" height="20" fill="white" transform="translate(0.5)" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <span>{loading ? 'Logging in...' : 'Login with Google'}</span>
                        </motion.button>
                    </form>
                </div>
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

export default Login;
