import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../Provider/useAxiosSecure';
import { useContext } from 'react';
import { AuthContext } from '../Provider/AuthProvider';

const useUserRole = () => {
    const { user, loading: authLoading } = useContext(AuthContext)
    const axiosSecure = useAxiosSecure();

    const {
        data: role = 'user',
        isLoading: roleLoading,
        refetch,
    } = useQuery({
        queryKey: ['userRole', user?.email],
        enabled: !authLoading && !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/role/${user.email}`);
            return res.data.role;
        },
    });

    return { role, roleLoading: authLoading || roleLoading, refetch };
};

export default useUserRole;