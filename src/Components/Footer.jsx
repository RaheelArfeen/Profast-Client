import React from 'react';
import logo from '../assets/assets/logo.png';
import { NavLink } from 'react-router';
import { motion } from 'framer-motion';

const Footer = () => {
    const links = (
        <div className="flex flex-wrap justify-center gap-12 lg:gap-8 text-white text-sm lg:text-base">
            {[
                { to: "/", label: "Home" },
                { to: "/addParcel", label: "Add Parcel" },
                { to: "/coverage", label: "Coverage" },
                { to: "/dashboard", label: "Dashboard" },
            ].map(({ to, label }, i) => (
                <motion.div
                    key={i}
                    whileHover={{ scale: 1.1, color: "#60a5fa" }}
                >
                    <NavLink to={to} className="capitalize">
                        {label}
                    </NavLink>
                </motion.div>
            ))}
        </div>
    );

    const socialIcons = (
        <div className="flex gap-6 justify-center items-center">
            {[
                "https://i.ibb.co/hwpMSN2/image.png",
                "https://i.ibb.co/Kpx8tFYq/image.png",
                "https://i.ibb.co/cc2MqrK2/image.png",
                "https://i.ibb.co/XZvzvFZT/image.png"
            ].map((src, index) => (
                <motion.img
                    key={index}
                    src={src}
                    alt={`icon${index + 1}`}
                    className="w-6 lg:w-8"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                />
            ))}
        </div>
    );

    return (
        <div className='max-w-[1800px] w-full mx-auto px-2 lg:px-12'>
            <div className='bg-black py-10 px-4 sm:px-6 lg:px-20 rounded-3xl mt-10 lg:mb-4 mb-2 w-full flex flex-col items-center text-center'>
                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer">
                    <img
                        src={logo}
                        alt="Logo"
                        className="w-10"
                    />
                    <h1 className="urbanist text-2xl lg:text-3xl relative top-3 right-7 font-extrabold text-white">
                        Profast
                    </h1>
                </div>

                {/* Description */}
                <p className='text-[#DADADA] max-w-xl mt-4 text-sm sm:text-base'>
                    Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle.
                    From personal packages to business shipments — we deliver on time, every time.
                </p>

                {/* Links */}
                <div className='border-y border-dashed border-[#03464D] w-full py-8 mt-6'>
                    {links}
                </div>

                {/* Social Icons */}
                <div className='mt-6'>
                    {socialIcons}
                </div>
            </div>
        </div>
    );
};

export default Footer;