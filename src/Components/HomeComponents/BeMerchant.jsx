import React from 'react';
import beAmerchant from '../../assets/assets/be-a-merchant-bg.png'
import locationMerchant from '../../assets/assets/location-merchant.png';

const BeMerchant = () => {
    return (
        <div className='max-w-[1800px] w-full mx-auto px-2 md:px-6 lg:px-12 py-12'>
            <div className='relative bg-[#03373D] rounded-3xl overflow-hidden'>
                {/* Background Image */}
                <img
                    src={beAmerchant}
                    alt='Background'
                    className='absolute inset-0 w-full h-full object-cover opacity-10 z-0'
                />

                {/* Content Container */}
                <div className='relative z-10 flex flex-col-reverse lg:flex-row items-center justify-between gap-10 px-6 md:px-12 py-16'>
                    {/* Text Content */}
                    <div className='w-full lg:w-1/2 text-center lg:text-left'>
                        <h1 className='text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6'>
                            Merchant and Customer Satisfaction is Our First Priority
                        </h1>
                        <p className='text-[#DADADA] text-base md:text-lg mb-6'>
                            We offer the lowest delivery charge with the highest value along with 100% safety of your product. Profast courier delivers your parcels in every corner of Bangladesh right on time.
                        </p>
                        <div className='flex flex-col md:flex-row items-center justify-center lg:justify-start gap-4'>
                            <button className='px-8 py-3 md:py-4 rounded-full bg-[#CAEB66] border-2 border-[#CAEB66] text-[#1F1F1F] text-lg md:text-xl font-bold transition hover:brightness-90'>
                                Become a Merchant
                            </button>
                            <button className='px-8 py-3 md:py-4 rounded-full bg-transparent border-2 border-[#CAEB66] text-[#CAEB66] text-lg md:text-xl font-bold transition hover:bg-[#CAEB66] hover:text-[#1F1F1F]'>
                                Earn with Profast Courier
                            </button>
                        </div>
                    </div>

                    {/* Image */}
                    <div className='w-full lg:w-1/2 flex justify-center'>
                        <img
                            src={locationMerchant}
                            alt='Location'
                            className='w-full max-w-[500px] md:max-w-[600px] lg:max-w-[700px]'
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BeMerchant;