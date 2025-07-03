import React, { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Provider/useAxiosSecure";
import useTrackingLogger from "../../../Provider/useTrackingLogger";
import { AuthContext } from "../../../Provider/AuthProvider";

const PendingDeliveries = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const { logTracking } = useTrackingLogger();
    const { user } = useContext(AuthContext);

    const { data: parcels = [], isLoading } = useQuery({
        queryKey: ["riderParcels"],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/rider/parcels?email=${user.email}`);
            return res.data;
        },
    });

    const { mutateAsync: updateStatus } = useMutation({
        mutationFn: async ({ parcel, status }) => {
            const res = await axiosSecure.patch(`/parcels/${parcel._id}/status`, {
                status,
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["riderParcels"]);
        },
    });

    const handleStatusUpdate = (parcel, newStatus) => {
        Swal.fire({
            title: "Are you sure?",
            text: `Mark parcel as ${newStatus.replace("_", " ")}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, update",
        }).then((result) => {
            if (result.isConfirmed) {
                updateStatus({ parcel, status: newStatus })
                    .then(async () => {
                        Swal.fire("Updated!", "Parcel status updated.", "success");

                        let trackDetails = `Picked up by ${user.displayName}`;
                        if (newStatus === "delivered") {
                            trackDetails = `Delivered by ${user.displayName}`;
                        }
                        await logTracking({
                            tracking_id: parcel.tracking_id,
                            status: newStatus,
                            details: trackDetails,
                            updated_by: user.email,
                        });
                    })
                    .catch(() => {
                        Swal.fire("Error!", "Failed to update status.", "error");
                    });
            }
        });
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Pending Deliveries</h2>

            {isLoading ? (
                <p className="text-gray-600 text-center">Loading...</p>
            ) : parcels.length === 0 ? (
                <p className="text-gray-500 italic text-center py-6">No assigned deliveries.</p>
            ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
                    <table className="min-w-full text-sm divide-y divide-gray-200">
                        <thead className="bg-gray-100 rounded-t-xl">
                            <tr>
                                {[
                                    "Tracking ID",
                                    "Title",
                                    "Type",
                                    "Receiver",
                                    "Receiver Center",
                                    "Cost",
                                    "Status",
                                    "Action",
                                ].map((heading) => (
                                    <th
                                        key={heading}
                                        className="px-4 py-3 text-left font-medium text-gray-700 uppercase text-xs"
                                    >
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 rounded-b-xl">
                            {parcels.map((parcel) => (
                                <tr
                                    key={parcel._id}
                                    className="hover:bg-gray-50 transition rounded-md"
                                >
                                    <td className="px-4 py-2 rounded-l-md">{parcel.tracking_id}</td>
                                    <td className="px-4 py-2">{parcel.title}</td>
                                    <td className="px-4 py-2">{parcel.type}</td>
                                    <td className="px-4 py-2">{parcel.receiver_name}</td>
                                    <td className="px-4 py-2">{parcel.receiver_center}</td>
                                    <td className="px-4 py-2">৳{parcel.cost}</td>
                                    <td className="px-4 py-2 capitalize">{parcel.delivery_status.replace("_", " ")}</td>
                                    <td className="px-4 py-2 flex gap-2 rounded-r-md">
                                        {parcel.delivery_status === "rider_assigned" && (
                                            <button
                                                onClick={() => handleStatusUpdate(parcel, "in_transit")}
                                                className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                                            >
                                                Mark Picked Up
                                            </button>
                                        )}
                                        {parcel.delivery_status === "in_transit" && (
                                            <button
                                                onClick={() => handleStatusUpdate(parcel, "delivered")}
                                                className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded-md transition"
                                            >
                                                Mark Delivered
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

export default PendingDeliveries;
