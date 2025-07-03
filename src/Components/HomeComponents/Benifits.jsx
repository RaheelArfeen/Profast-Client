import React from 'react';
import { motion } from 'framer-motion';
import liveTracking from '../../assets/assets/live-tracking.png';
import safeDelivery from '../../assets/assets/safe-delivery.png';

const Benifits = () => {
    const datas = [
        {
            title: "Live Parcel Tracking",
            description: "Stay updated in real-time with our advanced live parcel tracking system. From the moment your shipment is picked up to its final delivery, you can follow every step of the journey with detailed status updates. Our transparent tracking ensures complete visibility and peace of mind, allowing you to plan ahead and stay informed at all times.",
            image: liveTracking,
        },
        {
            title: "100% Safe Delivery",
            description: "We take every precaution to ensure your parcels are delivered in perfect condition. With our secure handling protocols, professional logistics team, and reliable transportation network, you can trust that your package will arrive safely and on time. From fragile items to valuable goods, we treat every delivery with the highest standard of care.",
            image: safeDelivery,
        },
        {
            title: "24/7 Call Center Support",
            description: "Our dedicated customer support team is available 24/7 to assist you with anything you need. Whether it’s tracking an order, changing delivery details, or resolving concerns, we’re here to help—day or night. Enjoy seamless communication and prompt responses from friendly, knowledgeable support agents who care about your experience.",
            image: safeDelivery,
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: (i = 1) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.2,
                duration: 0.6,
                ease: 'easeOut'
            }
        })
    };

    return (
        <section className='max-w-[1800px] w-full mx-auto py-4 px-2 md:px-6 lg:px-12'>
            <div className="flex flex-col border-y border-dashed border-[#03464D] py-16 gap-8">
                {datas.map((data, index) => (
                    <motion.div
                        key={index}
                        className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row items-center text-center md:text-left"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        custom={index}
                    >
                        <motion.div
                            className='flex justify-center mb-4 md:mb-0 md:mr-8'
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.2 + 0.2, duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <img src={data.image} alt={data.title} className="h-auto object-contain" />
                        </motion.div>
                        <div className='w-full flex flex-col justify-center border-t md:border-t-0 md:border-l min-h-[150px] border-dashed border-[#03464D] pt-6 md:pt-0 md:pl-8'>
                            <h3 className="text-2xl font-extrabold mb-2 text-[#03373D]">{data.title}</h3>
                            <p className="font-medium text-[#606060]">{data.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Benifits;
