import React from 'react';
import Banner from '../Components/Banner';
import Instructions from '../Components/HomeComponents/Instructions';
import Services from '../Components/HomeComponents/Services';
import LogoMarquee from '../Components/HomeComponents/LogoMarquee';
import Benifits from '../Components/HomeComponents/Benifits';
import BeMerchant from '../Components/HomeComponents/BeMerchant';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <Instructions></Instructions>
            <Services></Services>
            <LogoMarquee></LogoMarquee>
            <Benifits></Benifits>
            <BeMerchant></BeMerchant>
        </div>
    );
};

export default Home;