import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaSearch, FaUserSlash } from "react-icons/fa";
import useAxiosSecure from "../../../Provider/useAxiosSecure";

const ActiveRiders = () => {
    const axiosSecure = useAxiosSecure();
    const [searchTerm, setSearchTerm] = useState("");

    const { data: riders = [], isLoading, error, refetch } = useQuery({
        queryKey: ["activeRiders"],
        queryFn: async () => {
            const res = await axiosSecure.get("/riders/active");
            return res.data;
        },
    });

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
            Swal.fire("Success", "Rider has been deactivated", "success");
            refetch();
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Failed to deactivate rider", "error");
        }
    };

    const filteredRiders = riders.filter((rider) =>
        rider.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Active Riders</h2>

            {/* 🔍 Search */}
            <div className="mb-4 flex items-center gap-2 max-w-md">
                <FaSearch className="text-gray-500" />
                <input
                    type="text"
                    placeholder="Search by name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* 🌀 Status Messages */}
            {isLoading && <p className="text-center text-gray-600">Loading active riders...</p>}
            {error && <p className="text-center text-red-500">Failed to load riders</p>}

            {/* 📊 Riders Table */}
            {!isLoading && !error && (
                <div className="overflow-x-auto border border-gray-200 rounded-md shadow-sm">
                    <table className="min-w-full text-sm divide-y divide-gray-200">
                        <thead className="bg-gray-100">
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
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredRiders.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="py-6 text-center text-gray-500 italic">
                                        No matching riders found.
                                    </td>
                                </tr>
                            ) : (
                                filteredRiders.map((rider) => (
                                    <tr key={rider._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2">{rider.name}</td>
                                        <td className="px-4 py-2">{rider.email}</td>
                                        <td className="px-4 py-2">{rider.phone}</td>
                                        <td className="px-4 py-2">{rider.region}</td>
                                        <td className="px-4 py-2">{rider.district}</td>
                                        <td className="px-4 py-2">
                                            {rider.bike_brand} - {rider.bike_registration}
                                        </td>
                                        <td className="px-4 py-2">
                                            <span className="inline-block px-2 py-1 text-xs font-medium bg-green-500 text-white rounded">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => handleDeactivate(rider._id)}
                                                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
                                            >
                                                <FaUserSlash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ActiveRiders;
