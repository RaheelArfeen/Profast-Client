import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Provider/useAxiosSecure";
import { useContext } from "react";
import { AuthContext } from "../../../Provider/AuthProvider";

const CompletedDeliveries = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const { user } = useContext(AuthContext);
    const email = user?.email;

    const { data: parcels = [], isLoading } = useQuery({
        queryKey: ["completedDeliveries", email],
        enabled: !!email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/rider/completed-parcels?email=${email}`);
            return res.data;
        },
    });

    const calculateEarning = (parcel) => {
        const cost = Number(parcel.cost);
        if (parcel.sender_center === parcel.receiver_center) {
            return cost * 0.8;
        } else {
            return cost * 0.3;
        }
    };

    const { mutateAsync: cashout } = useMutation({
        mutationFn: async (parcelId) => {
            const res = await axiosSecure.patch(`/parcels/${parcelId}/cashout`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["completedDeliveries"]);
        },
    });

    const handleCashout = (parcelId) => {
        Swal.fire({
            title: "Confirm Cashout",
            text: "You are about to cash out this delivery.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Cash Out",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                cashout(parcelId)
                    .then(() => {
                        Swal.fire("Success", "Cashout completed.", "success");
                    })
                    .catch(() => {
                        Swal.fire("Error", "Failed to cash out. Try again.", "error");
                    });
            }
        });
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Completed Deliveries</h2>
            {isLoading ? (
                <p className="text-gray-600">Loading deliveries...</p>
            ) : parcels.length === 0 ? (
                <p className="text-gray-500">No deliveries yet.</p>
            ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-md shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                {[
                                    "Tracking ID",
                                    "Title",
                                    "From",
                                    "To",
                                    "Picked At",
                                    "Delivered At",
                                    "Fee (৳)",
                                    "Earning (৳)",
                                    "Cashout",
                                ].map((header) => (
                                    <th
                                        key={header}
                                        className="px-4 py-3 text-left font-medium text-gray-700 uppercase tracking-wide text-xs"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {parcels.map((parcel) => (
                                <tr key={parcel._id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3 font-medium">{parcel.tracking_id}</td>
                                    <td className="px-4 py-3">{parcel.title}</td>
                                    <td className="px-4 py-3">{parcel.sender_center}</td>
                                    <td className="px-4 py-3">{parcel.receiver_center}</td>
                                    <td className="px-4 py-3">
                                        {parcel.picked_at
                                            ? new Date(parcel.picked_at).toLocaleString()
                                            : "N/A"}
                                    </td>
                                    <td className="px-4 py-3">
                                        {parcel.delivered_at
                                            ? new Date(parcel.delivered_at).toLocaleString()
                                            : "N/A"}
                                    </td>
                                    <td className="px-4 py-3">৳{parcel.cost}</td>
                                    <td className="px-4 py-3 font-semibold text-green-600">
                                        ৳{calculateEarning(parcel).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3">
                                        {parcel.cashout_status === "cashed_out" ? (
                                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                                                Cashed Out
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => handleCashout(parcel._id)}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1 rounded"
                                            >
                                                Cashout
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CompletedDeliveries;
