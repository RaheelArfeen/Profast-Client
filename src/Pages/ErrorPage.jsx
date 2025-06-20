import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import errorAnimation from '../assets/animations/error.json';
import Lottie from 'lottie-react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';

const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <div className='flex flex-col justify-between min-h-screen'>
            <Header />
            <div className='max-w-[1800px] w-full mx-auto py-4 px-2 md:px-6 lg:px-12'>
                <div className='bg-white rounded-2xl flex justify-center items-center py-10 flex-col'>
                    {/* Animate Lottie */}
                    <motion.div
                        className='w-[800px] h-[400px]'
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <Lottie animationData={errorAnimation} />
                    </motion.div>

                    {/* Animate heading */}
                    <motion.h1
                        className='text-[#1A1A1A] font-extrabold text-5xl mt-4'
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        404 Error
                    </motion.h1>

                    {/* Animate button */}
                    <motion.button
                        onClick={() => navigate('/')}
                        className='mt-6 px-8 py-4 rounded-lg bg-[#CAEB66] text-[#1F1F1F] font-bold cursor-pointer'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Go Home
                    </motion.button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ErrorPage;
