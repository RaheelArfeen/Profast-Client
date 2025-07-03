import axios from 'axios';
import { useContext } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from './AuthProvider';

const axiosSecure = axios.create({
    baseURL: `https://profast-server.onrender.com`
});

const useAxiosSecure = () => {
    const { user, logOut } = useContext(AuthContext);
    const navigate = useNavigate();

    axiosSecure.interceptors.request.use(config => {
        config.headers.Authorization = `Bearer ${user.accessToken}`
        return config;
    }, error => {
        return Promise.reject(error);
    })

    axiosSecure.interceptors.response.use(res => {
        return res;
    }, error => {
        const status = error.status;
        if (status === 403) {
            navigate('/dashboard/forbidden');
        }
        else if (status === 401) {
            logOut()
                .then(() => {
                    navigate('/signUp')
                })
                .catch(() => { })
        }

        return Promise.reject(error);
    })


    return axiosSecure;
};

export default useAxiosSecure;