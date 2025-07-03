import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import logo from '../assets/assets/logo.png';
import authImg from '../assets/assets/authImage.png';

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Update with your backend URL
    const backendUrl = 'https://profast-server.onrender.com';

    const handleSendCode = async (e) => {
        e.preventDefault();
        setError('');
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            return setError('Please enter a valid email');
        }

        setLoading(true);
        try {
            await axios.post(`${backendUrl}/send-reset-code`, { email });
            toast.success(`A verification code has been sent to ${email}`);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send code. Try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setError('');
        if (!code || code.length !== 6) {
            return setError('Please enter the 6-digit code');
        }

        setLoading(true);
        try {
            await axios.post(`${backendUrl}/verify-reset-code`, { email, code });
            toast.success('Code verified');
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired code');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        if (!newPassword || newPassword.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        setLoading(true);
        try {
            await axios.post(`${backendUrl}/reset-password`, { email, password: newPassword });
            toast.success('Password has been reset successfully!');
            navigate('/signIn');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-white">
            {/* Left Section */}
            <motion.div
                initial={{ x: -60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="flex-1 flex items-center justify-center px-6 md:px-12 py-10 relative"
            >
                {/* Logo */}
                <div
                    className="flex items-center gap-2 absolute top-5 md:left-8 left-6 cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    <motion.img src={logo} alt="Logo" className="w-10" />
                    <motion.h1 className="urbanist text-2xl lg:text-3xl font-extrabold relative top-4 right-6.5">
                        Profast
                    </motion.h1>
                </div>

                {/* Form */}
                <div className="w-full max-w-md">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {step === 1 ? 'Reset Your Password' : step === 2 ? 'Enter Verification Code' : 'Set New Password'}
                    </h1>
                    <p className="text-gray-600 mb-6">
                        {step === 1 && 'Enter your email to receive a verification code'}
                        {step === 2 && 'Check your email and enter the 6-digit code'}
                        {step === 3 && 'Create your new password'}
                    </p>

                    <form
                        onSubmit={
                            step === 1
                                ? handleSendCode
                                : step === 2
                                    ? handleVerifyCode
                                    : handleResetPassword
                        }
                        className="space-y-6"
                    >
                        {step === 1 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 ${error
                                            ? 'border-red-500 focus:ring-red-300'
                                            : 'border-gray-300 focus:ring-green-500'
                                        } transition`}
                                />
                            </div>
                        )}

                        {step === 2 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Verification Code
                                </label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="123456"
                                    maxLength={6}
                                    className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 ${error
                                            ? 'border-red-500 focus:ring-red-300'
                                            : 'border-gray-300 focus:ring-green-500'
                                        } transition`}
                                />
                            </div>
                        )}

                        {step === 3 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="New Password"
                                    className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 ${error
                                            ? 'border-red-500 focus:ring-red-300'
                                            : 'border-gray-300 focus:ring-green-500'
                                        } transition`}
                                />
                            </div>
                        )}

                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full ${loading ? 'bg-green-400' : 'bg-green-500 hover:bg-green-600'
                                } text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200`}
                        >
                            {loading
                                ? 'Processing...'
                                : step === 1
                                    ? 'Send Code'
                                    : step === 2
                                        ? 'Verify Code'
                                        : 'Reset Password'}
                        </button>

                        {step === 1 && (
                            <p className="text-sm text-gray-600 text-center mt-4">
                                Back to{' '}
                                <span
                                    onClick={() => navigate('/signIn')}
                                    className="text-green-600 hover:text-green-700 font-medium cursor-pointer"
                                >
                                    Sign In
                                </span>
                            </p>
                        )}
                    </form>
                </div>
            </motion.div>

            {/* Right Section */}
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
                    alt="Forget Password Illustration"
                />
            </motion.div>
        </div>
    );
};

export default ForgetPassword;
