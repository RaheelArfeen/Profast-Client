import { useContext, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaSearch, FaUserShield } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Provider/useAxiosSecure";
import { AuthContext } from "../../../Provider/AuthProvider";

const MakeAdmin = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useContext(AuthContext);
    const [emailQuery, setEmailQuery] = useState("");

    const {
        data: users = [],
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ["searchedUser", emailQuery],
        queryFn: async () => {
            try {
                if (!emailQuery) {
                    const res = await axiosSecure.get("/users");
                    return res.data || [];
                } else {
                    const res = await axiosSecure.get(`/users/${emailQuery}`);
                    return res.data ? [res.data] : [];
                }
            } catch (error) {
                return [];
            }
        },
    });

    const { mutateAsync: makeAdmin } = useMutation({
        mutationFn: async ({ email }) =>
            await axiosSecure.patch(`/users/make-admin/${email}`),
        onSuccess: () => {
            refetch();
        },
    });

    const handleMakeAdmin = async (email, currentRole) => {
        if (currentRole === "admin") {
            Swal.fire("Info", "User is already an admin", "info");
            return;
        }

        const confirm = await Swal.fire({
            title: `Make this user an admin?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel",
        });

        if (!confirm.isConfirmed) return;

        try {
            await makeAdmin({ email });
            Swal.fire("Success", "User promoted to admin successfully", "success");
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Failed to update user role", "error");
        }
    };

    return (
        <div className="p-6 mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Make Admin</h2>

            {/* Search Input */}
            <div className="flex items-center gap-2 mb-6">
                <FaSearch className="text-gray-500" />
                <input
                    type="text"
                    placeholder="Search user by email"
                    value={emailQuery}
                    onChange={(e) => setEmailQuery(e.target.value)}
                    className="w-full max-w-md border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Loading */}
            {isFetching && <p className="text-gray-600">Loading user...</p>}

            {/* No Result */}
            {!isFetching && users.length === 0 && emailQuery && (
                <p className="text-gray-500">No user found.</p>
            )}

            {/* User Table */}
            {users.length > 0 && (
                <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                                    Email
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                                    Name
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                                    Role
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {users.map((u) => (
                                <tr key={u._id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-2">{u.email}</td>
                                    <td className="px-4 py-2">{u.displayName || "-"}</td>
                                    <td className="px-4 py-2">
                                        <span
                                            className={`inline-block px-2 py-1 text-xs rounded font-medium ${u.role === "admin"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {u.role || "user"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() =>
                                                handleMakeAdmin(u.email, u.role || "user")
                                            }
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                                        >
                                            <FaUserShield />
                                            Make Admin
                                        </button>
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

export default MakeAdmin;
