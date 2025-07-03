import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router';
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
    deleteUser
} from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from '../Firebase/Firebase.init';
import { toast } from 'sonner';
import axios from 'axios';
import { motion } from 'framer-motion';
import logo from '../assets/assets/logo.png';
import authImg from '../assets/assets/authImage.png';
import userImg from '../assets/assets/image-upload-icon.png';

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

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
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
        const { name, email, password, confirmPassword } = formData;
        if (!name.trim()) newErrors.name = 'Name is required';
        if (!email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
        if (!password) newErrors.password = 'Password is required';
        if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
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
                throw new Error('404 error cannot login');
            } catch {
                await deleteUser(user);
                throw new Error('Something went wrong while setting up your account. Please try again.');
            }
        }
    };

    const handleGoogleRegister = async () => {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            await sendUserToBackend(user);
            toast.success('Successfully registered with Google');
            navigate(from, { replace: true });
        } catch (error) {
            toast.error('Google registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const uploadProfileImage = async (file, uid) => {
        const storage = getStorage();
        const storageRef = ref(storage, `profileImages/${uid}-${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        return url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        const { name, email, password } = formData;
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            let photoURL = '';
            if (imageFile) {
                photoURL = await uploadProfileImage(imageFile, result.user.uid);
            }
            await updateProfile(result.user, { displayName: name, photoURL });
            await sendUserToBackend({ ...result.user, displayName: name, photoURL });
            toast.success('Successfully registered');
            navigate(from, { replace: true });
        } catch (error) {
            toast.error(error.message || 'Failed to register. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-white">
            {/* Left */}
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

                <motion.div
                    className="relative w-full max-w-md"
                    initial="hidden"
                    animate="visible"
                    variants={fadeVariant}
                >
                    <motion.div variants={fadeVariant} custom={0}>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                        <p className="text-gray-600">Register with Profast</p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                        {/* Avatar */}
                        <motion.div className="flex" variants={fadeVariant} custom={1}>
                            <motion.div className="relative group w-16 h-16" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="avatarUpload"
                                />
                                <label htmlFor="avatarUpload" className="cursor-pointer group">
                                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Selected" className="w-full h-full object-cover" />
                                        ) : (
                                            <img src={userImg} className='h-full w-full object-cover' alt="" />
                                        )}
                                    </div>
                                </label>
                                {imagePreview && (
                                    <motion.button
                                        type="button"
                                        onClick={() => {
                                            setImagePreview('');
                                            setImageFile(null);
                                        }}
                                        className="absolute top-0 -right-1 bg-white p-0.5 rounded-full border hover:bg-red-100"
                                        whileHover={{ scale: 1.2 }}
                                    >
                                        <X size={16} className="text-red-500" />
                                    </motion.button>
                                )}
                            </motion.div>
                        </motion.div>

                        {/* Input Fields */}
                        {['name', 'email', 'password', 'confirmPassword'].map((field, index) => (
                            <motion.div key={field} variants={fadeVariant} custom={index + 2}>
                                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                                <div className="relative">
                                    <input
                                        type={field.includes('password') && !field.includes('confirm') ? (showPassword ? 'text' : 'password') : field === 'confirmPassword' ? 'password' : 'text'}
                                        value={formData[field]}
                                        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                                        placeholder={field === 'confirmPassword' ? 'Confirm Password' : field[0].toUpperCase() + field.slice(1)}
                                        className={`w-full px-4 py-3 ${field.includes('password') ? 'pr-12' : ''} border rounded-lg ${errors[field] ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {field === 'password' && (
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    )}
                                </div>
                                {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
                            </motion.div>
                        ))}

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full ${loading ? 'bg-green-400' : 'bg-green-500 hover:bg-green-600'} text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200`}
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </motion.button>

                        {/* Login redirect */}
                        <motion.div className="text-center" variants={fadeVariant} custom={7}>
                            <span className="text-gray-600">Already have an account? </span>
                            <Link to="/signIn" className="text-green-600 hover:text-green-700 font-medium">Sign In</Link>
                        </motion.div>

                        {/* Divider */}
                        <motion.div className="relative my-8" variants={fadeVariant} custom={8}>
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-4 text-gray-500">Or</span>
                            </div>
                        </motion.div>

                        {/* Google Register */}
                        <motion.button
                            type="button"
                            onClick={handleGoogleRegister}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            className={`w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-4 px-6 rounded-lg flex items-center justify-center space-x-3 border border-gray-300 ${loading ? 'opacity-70' : ''}`}
                            disabled={loading}
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_2074_643)">
                                    <path d="M20.0002 10.2297C20.0002 9.54995 19.944 8.8665 19.824 8.19775H10.2008V12.0486H15.7115C15.4829 13.2905 14.7481 14.3892 13.6722 15.0873V17.586H16.9599C18.8905 15.8443 20.0002 13.2722 20.0002 10.2297Z" fill="#1C71FF" />
                                    <path d="M10.2006 19.9999C12.9523 19.9999 15.2728 19.1144 16.9635 17.5858L13.6758 15.0872C12.7611 15.6971 11.5802 16.0425 10.2044 16.0425C7.54273 16.0425 5.28593 14.2825 4.47619 11.9161H1.0835V14.4919C2.81546 17.8687 6.3431 19.9999 10.2006 19.9999Z" fill="#34A853" />
                                    <path d="M4.47264 11.9163C4.04527 10.6743 4.04527 9.32946 4.47264 8.0875V5.51172H1.0837C-0.363349 8.33736 -0.363349 11.6664 1.0837 14.4921L4.47264 11.9163Z" fill="#FBBC04" />
                                    <path d="M10.2006 3.95732C11.6552 3.93527 13.061 4.47174 14.1144 5.45649L17.0273 2.60145C15.1828 0.903854 12.7349 -0.0294541 10.2006 -5.85339e-05C6.3431 -5.85339e-05 2.81546 2.13112 1.0835 5.5116L4.47244 8.08739C5.27844 5.71737 7.53898 3.95732 10.2006 3.95732Z" fill="#EA4335" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_2074_643">
                                        <rect width="20" height="20" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <span>{loading ? 'Processing...' : 'Register with Google'}</span>
                        </motion.button>
                    </form>
                </motion.div>
            </motion.div>

            {/* Right Illustration */}
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

export default Register;