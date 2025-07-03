import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import { motion } from 'framer-motion';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import banner1 from '../assets/assets/banner/banner1.png'
import banner2 from '../assets/assets/banner/banner2.png'
import banner3 from '../assets/assets/banner/banner3.png'

const slideVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const Banner = () => {
    return (
        <div className='max-w-[1800px] w-full mx-auto px-2 lg:px-12'>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={slideVariant}
            >
                <Carousel
                    autoPlay
                    infiniteLoop
                    showThumbs={false}
                    showStatus={false}
                    showArrows={false}
                    showIndicators={true}
                    interval={5000}
                    emulateTouch
                    className="rounded-xl overflow-hidden"
                >
                    {[banner1, banner2, banner3].map((banner, idx) => (
                        <div key={idx} className="h-full overflow-hidden rounded-xl">
                            <motion.img
                                src={banner}
                                draggable="false"
                                className="md:h-[700px] lg:object-cover h-[300px] select-none pointer-events-none"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.4 }}
                                alt={`banner${idx + 1}`}
                            />
                        </div>
                    ))}
                </Carousel>
            </motion.div>
        </div>
    );
};

export default Banner;