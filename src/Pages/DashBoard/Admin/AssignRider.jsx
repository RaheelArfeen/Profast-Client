import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaMotorcycle } from "react-icons/fa";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Provider/useAxiosSecure";

const AssignRider = () => {
    const axiosSecure = useAxiosSecure();
    const [selectedParcel, setSelectedParcel] = useState(null);
    const [riders, setRiders] = useState([]);
    const [loadingRiders, setLoadingRiders] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const queryClient = useQueryClient();

    const { data: parcels = [], isLoading } = useQuery({
        queryKey: ["assignableParcels"],
        queryFn: async () => {
            const res = await axiosSecure.get(
                "/parcels?payment_status=paid&delivery_status=pending"
            );
            return res.data.sort(
                (a, b) => new Date(a.creation_date) - new Date(b.creation_date)
            );
        },
    });

    const { mutateAsync: assignRider } = useMutation({
        mutationFn: async ({ parcelId, rider }) => {
            const res = await axiosSecure.patch(`/parcels/${parcelId}/assign`, {
                riderId: rider._id,
                riderName: rider.name,
                riderEmail: rider.email,
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["assignableParcels"]);
            Swal.fire("Success", "Rider assigned successfully!", "success");
            setShowModal(false);
        },
        onError: () => {
            Swal.fire("Error", "Failed to assign rider", "error");
        },
    });

    const openAssignModal = async (parcel) => {
        setSelectedParcel(parcel);
        setLoadingRiders(true);
        setRiders([]);
        setShowModal(true);
        try {
            const res = await axiosSecure.get("/riders/active", {
                params: {
                    district: parcel.sender_center,
                },
            });
            setRiders(res.data);
        } catch (error) {
            Swal.fire("Error", "Failed to load riders", "error");
        } finally {
            setLoadingRiders(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Assign Rider to Parcels</h2>

            {isLoading ? (
                <p className="text-gray-600">Loading parcels...</p>
            ) : parcels.length === 0 ? (
                <p className="text-gray-500">No parcels available for assignment.</p>
            ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-md shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                {[
                                    "Tracking ID",
                                    "Title",
                                    "Type",
                                    "Sender Center",
                                    "Receiver Center",
                                    "Cost",
                                    "Created At",
                                    "Action",
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
                                    <td className="px-4 py-3">{parcel.type}</td>
                                    <td className="px-4 py-3">{parcel.sender_center}</td>
                                    <td className="px-4 py-3">{parcel.receiver_center}</td>
                                    <td className="px-4 py-3">৳{parcel.cost}</td>
                                    <td className="px-4 py-3">
                                        {new Date(parcel.creation_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => openAssignModal(parcel)}
                                            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                        >
                                            <FaMotorcycle />
                                            Assign Rider
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl"
                        >
                            <h3 className="text-lg font-bold mb-4">
                                Assign Rider for Parcel:{" "}
                                <span className="text-blue-600">{selectedParcel?.title}</span>
                            </h3>

                            {loadingRiders ? (
                                <p className="text-gray-600">Loading riders...</p>
                            ) : riders.length === 0 ? (
                                <p className="text-red-600">No available riders in this district.</p>
                            ) : (
                                <div className="overflow-x-auto max-h-80 overflow-y-auto border border-gray-200 rounded-md shadow-inner">
                                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                                                    Name
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                                                    Phone
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                                                    Bike Info
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {riders.map((rider) => (
                                                <tr key={rider._id}>
                                                    <td className="px-4 py-2">{rider.name}</td>
                                                    <td className="px-4 py-2">{rider.phone}</td>
                                                    <td className="px-4 py-2">
                                                        {rider.bike_brand} - {rider.bike_registration}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <button
                                                            onClick={() =>
                                                                assignRider({
                                                                    parcelId: selectedParcel._id,
                                                                    rider,
                                                                })
                                                            }
                                                            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                                        >
                                                            Assign
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AssignRider;