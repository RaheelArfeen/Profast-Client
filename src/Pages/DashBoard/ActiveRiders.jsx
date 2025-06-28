import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaSearch, FaUserSlash } from "react-icons/fa";
import useAxiosSecure from "../../Provider/useAxiosSecure";

const ActiveRiders = () => {
    const axiosSecure = useAxiosSecure();
    const [searchTerm, setSearchTerm] = useState("");

    // Load Active Riders with React Query
    const { data: riders = [], isLoading, refetch, error } = useQuery({
        queryKey: ["activeRiders"],
        queryFn: async () => {
            const res = await axiosSecure.get("/riders/active");
            return res.data;
        },
    });

    // Handle Deactivation
    const handleDeactivate = async (id) => {
        const confirm = await Swal.fire({
            title: "Deactivate this rider?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, deactivate",
            cancelButtonText: "Cancel",
        });

        if (!confirm.isConfirmed) return;

        try {
            await axiosSecure.patch(`/riders/${id}/status`, { status: "deactivated" });
            Swal.fire("Done", "Rider has been deactivated", "success");
            refetch();
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Failed to deactivate rider", "error");
        }
    };

    // Filtered List
    const filteredRiders = riders.filter((rider) =>
        rider.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Active Riders</h2>

            {/* Search Field */}
            <div className="mb-6 flex items-center gap-3 max-w-md">
                <FaSearch className="text-gray-500" />
                <input
                    type="text"
                    placeholder="Search by name"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Loading/Error */}
            {isLoading && (
                <p className="text-center text-gray-600">Loading active riders...</p>
            )}
            {error && (
                <p className="text-center text-red-600">Failed to load riders</p>
            )}

            {/* Rider Table */}
            {!isLoading && !error && (
                <div className="overflow-x-auto border border-gray-200 rounded-md shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {[
                                    "Name",
                                    "Email",
                                    "Phone",
                                    "Region",
                                    "District",
                                    "Bike",
                                    "Status",
                                    "Action",
                                ].map((header) => (
                                    <th
                                        key={header}
                                        className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredRiders.length > 0 ? (
                                filteredRiders.map((rider) => (
                                    <tr key={rider._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 font-medium">
                                            {rider.name}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-700 text-sm">
                                            {rider.email}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-700 text-sm">
                                            {rider.phone}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-700 text-sm">
                                            {rider.region}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-700 text-sm">
                                            {rider.district}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-700 text-sm">
                                            {rider.bike_brand} - {rider.bike_registration}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="inline-block bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <button
                                                onClick={() => handleDeactivate(rider._id)}
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                            >
                                                <FaUserSlash /> Deactivate
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="px-4 py-5 text-center text-gray-500 italic"
                                    >
                                        No matching riders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ActiveRiders;
