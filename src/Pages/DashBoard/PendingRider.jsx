import { useState } from "react";
import Swal from "sweetalert2";
import { FaEye, FaCheck, FaTimes } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Provider/useAxiosSecure";
import { motion, AnimatePresence } from "framer-motion";

const PendingRiders = () => {
    const [selectedRider, setSelectedRider] = useState(null);
    const axiosSecure = useAxiosSecure();

    const { isPending, data: riders = [], refetch } = useQuery({
        queryKey: ["pending-riders"],
        queryFn: async () => {
            const res = await axiosSecure.get("/riders/pending");
            return res.data;
        },
    });

    const handleDecision = async (id, action, email) => {
        const confirm = await Swal.fire({
            title: `${action === "approve" ? "Approve" : "Reject"} Application?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel",
        });

        if (!confirm.isConfirmed) return;

        try {
            const status = action === "approve" ? "active" : "rejected";
            await axiosSecure.patch(`/riders/${id}/status`, { status, email });

            refetch();
            Swal.fire("Success", `Rider ${action}d successfully`, "success");
        } catch (err) {
            Swal.fire("Error", "Could not update rider status", "error");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Pending Rider Applications</h2>

            {isPending ? (
                <p className="text-gray-600">Loading...</p>
            ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-md shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                {[
                                    "Name",
                                    "Email",
                                    "Region",
                                    "District",
                                    "Phone",
                                    "Applied",
                                    "Actions",
                                ].map((th) => (
                                    <th
                                        key={th}
                                        className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase"
                                    >
                                        {th}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {riders.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-4 py-5 text-center text-gray-500 italic text-lg">
                                        No matching riders found.
                                    </td>
                                </tr>
                            ) : (
                                riders.map((rider) => (
                                    <tr key={rider._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2">{rider.name}</td>
                                        <td className="px-4 py-2">{rider.email}</td>
                                        <td className="px-4 py-2">{rider.region}</td>
                                        <td className="px-4 py-2">{rider.district}</td>
                                        <td className="px-4 py-2">{rider.phone}</td>
                                        <td className="px-4 py-2">
                                            {new Date(rider.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-2 flex gap-2">
                                            <button
                                                onClick={() => setSelectedRider(rider)}
                                                className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            >
                                                <FaEye />
                                            </button>
                                            <button
                                                onClick={() => handleDecision(rider._id, "approve", rider.email)}
                                                className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                            >
                                                <FaCheck />
                                            </button>
                                            <button
                                                onClick={() => handleDecision(rider._id, "reject", rider.email)}
                                                className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                            >
                                                <FaTimes />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Rider Details Modal */}
            <AnimatePresence>
                {selectedRider && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl relative"
                        >
                            <h3 className="text-xl font-bold mb-4 text-blue-700">
                                Rider Details
                            </h3>
                            <div className="space-y-2 text-sm text-gray-700">
                                <p>
                                    <strong>Name:</strong> {selectedRider.name}
                                </p>
                                <p>
                                    <strong>Email:</strong> {selectedRider.email}
                                </p>
                                <p>
                                    <strong>Phone:</strong> {selectedRider.phone}
                                </p>
                                <p>
                                    <strong>Age:</strong> {selectedRider.age}
                                </p>
                                <p>
                                    <strong>NID:</strong> {selectedRider.nid}
                                </p>
                                <p>
                                    <strong>Bike Brand:</strong> {selectedRider.bike_brand}
                                </p>
                                <p>
                                    <strong>Bike Registration:</strong>{" "}
                                    {selectedRider.bike_registration}
                                </p>
                                <p>
                                    <strong>Region:</strong> {selectedRider.region}
                                </p>
                                <p>
                                    <strong>District:</strong> {selectedRider.district}
                                </p>
                                <p>
                                    <strong>Applied At:</strong>{" "}
                                    {new Date(selectedRider.created_at).toLocaleString()}
                                </p>
                                {selectedRider.note && (
                                    <p>
                                        <strong>Note:</strong> {selectedRider.note}
                                    </p>
                                )}
                            </div>
                            <div className="mt-6 text-right">
                                <button
                                    onClick={() => setSelectedRider(null)}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
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

export default PendingRiders;
