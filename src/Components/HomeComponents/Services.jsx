import React from "react";
import { motion } from "framer-motion";
import services from "../../assets/data/services.json";
import serviceIcon from "../../assets/assets/service.png";

// Animation variants
const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut",
            staggerChildren: 0.15,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

export default function Services() {
    return (
        <div className="max-w-[1800px] w-full mx-auto py-4 px-2 md:px-6 lg:px-12">
            <motion.section
                className="bg-[#003A40] text-white px-4 py-12 md:px-16 rounded-[2rem]"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={containerVariants}
            >
                <div className="text-center mb-10">
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold"
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Our Services
                    </motion.h2>
                    <motion.p
                        className="text-sm md:text-base mt-4 max-w-2xl mx-auto text-gray-200"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time.
                    </motion.p>
                </div>

                {/* Grid layout on medium and up */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map(({ title, description }, index) => (
                        <motion.div
                            key={index}
                            className="rounded-xl p-6 bg-white text-[#003A40] shadow-md"
                            variants={cardVariants}
                            whileHover={{ scale: 1.03 }}
                        >
                            <div className="mb-4">
                                <div className="w-16 h-16 mx-auto rounded-full bg-[#FAFAFA] flex items-center justify-center">
                                    <img src={serviceIcon} alt="" />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-center">{title}</h3>
                            <p className="text-sm text-center">{description}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.section>
        </div>
    );
}
