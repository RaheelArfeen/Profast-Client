import React from 'react';
import Marquee from 'react-fast-marquee';

import amazon from '../../assets/assets/brands/casio.png';
import google from '../../assets/assets/brands/amazon_vector.png';
import casio from '../../assets/assets/brands/moonstar.png';
import moonstar from '../../assets/assets/brands/start.png';
import start from '../../assets/assets/brands/start-people 1.png';
import randstad from '../../assets/assets/brands/randstad.png';

const logos = [amazon, google, casio, moonstar, start, randstad];

const LogoMarquee = () => {
    return (
        <section className="py-10">
            <div className="max-w-[1800px] w-full mx-auto py-4 px-2 md:px-6 lg:px-12">
                <h2 className="text-2xl text-primary font-bold text-center mb-12">Trusted by Leading Brands</h2>

                <Marquee pauseOnHover speed={50} gradient={false}>
                    {logos.map((logo, idx) => (
                        <div key={idx} className="mx-24 flex items-center">
                            <img src={logo} alt={`Client Logo ${idx + 1}`} className="h-6 object-contain" />
                        </div>
                    ))}
                </Marquee>
            </div>
        </section>
    );
};

export default LogoMarquee;
