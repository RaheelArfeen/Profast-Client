import React, { useContext, useEffect } from 'react';
import Banner from '../Components/Banner';
import Instructions from '../Components/HomeComponents/Instructions';
import Services from '../Components/HomeComponents/Services';
import LogoMarquee from '../Components/HomeComponents/LogoMarquee';
import Benifits from '../Components/HomeComponents/Benifits';
import BeMerchant from '../Components/HomeComponents/BeMerchant';
import { AuthContext } from '../Provider/AuthProvider';
import axios from 'axios';

const Home = () => {
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (!user?.email) return;  // only run if user and user.email exist

        const fetchRole = async () => {
            try {
                const roleRes = await axios.get(`http://localhost:3000/role/${user.email}`);
                console.log('Role response:', roleRes.data);
            } catch (error) {
                console.error('Error fetching role:', error);
            }
        };

        fetchRole();
    }, [user?.email]); // run only when user.email changes

    return (
        <div>
            <Banner />
            <Instructions />
            <Services />
            <LogoMarquee />
            <Benifits />
            <BeMerchant />
        </div>
    );
};

export default Home;
