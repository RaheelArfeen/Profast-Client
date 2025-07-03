import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../../Provider/AuthProvider';
import useAxiosSecure from '../../Provider/useAxiosSecure';

const formatDate = (iso) => new Date(iso).toLocaleString();

const PaymentHistory = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const { isPending, data: payments = [] } = useQuery({
        queryKey: ['payments', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments?email=${user.email}`);
            return res.data;
        }
    });

    if (isPending) {
        return (
            <div className="flex items-center justify-center h-48 text-green-700 font-semibold">
                Loading payment history...
            </div>
        );
    }

    return (
        <div className='max-w-[1800px] w-full mx-auto py-4 px-2 md:px-6 lg:px-12'>
            <div className="overflow-x-auto shadow-lg rounded-xl bg-white">
                <h2 className="text-2xl font-semibold px-6 py-4 border-b border-[#c8ed63] text-[#1a1a1a]">
                    Payment History
                </h2>
                <table className="min-w-full divide-y divide-[#c8ed63] text-sm text-[#1f1f1f]">
                    <thead className="uppercase font-semibold text-[#333] text-xs bg-white">
                        <tr>
                            <th className="px-6 py-3 text-left">#</th>
                            <th className="px-6 py-3 text-left">Parcel ID</th>
                            <th className="px-6 py-3 text-left">Amount</th>
                            <th className="px-6 py-3 text-left">Transaction ID</th>
                            <th className="px-6 py-3 text-left">Paid At</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f0f0]">
                        {payments.length > 0 ? (
                            payments.map((p, index) => (
                                <tr
                                    key={p.transactionId}
                                    title="Click for more details"
                                    className="hover:bg-gray-50 transition"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                                    <td className="px-6 py-4 truncate max-w-xs" title={p.parcelId}>
                                        {p.parcelId}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-[#1f1f1f]">
                                        ৳{p.amount}
                                    </td>
                                    <td
                                        className="px-6 py-4 font-mono text-xs truncate max-w-xs"
                                        title={p.transactionId}
                                    >
                                        {p.transactionId}
                                    </td>
                                    <td className="px-6 py-4">{formatDate(p.paid_at_string)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="px-6 py-10 text-center text-[#555]"
                                >
                                    No payment history found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentHistory;
