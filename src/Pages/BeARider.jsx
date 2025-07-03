import React, { useEffect, useState, useRef, useContext } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useLoaderData } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import useAxiosSecure from "../Provider/useAxiosSecure";
import { AuthContext } from "../Provider/AuthProvider";
import riderImg from "../assets/assets/agent-pending.png";

// Reusable Dropdown Component
const Dropdown = ({ label, options, selected, onSelect, placeholder, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="space-y-2 relative" ref={ref}>
            <label className="text-slate-700 font-medium">{label}</label>
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full border ${disabled ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer hover:shadow-md"
                    } border-gray-300 rounded-lg px-4 py-2 text-gray-700 flex items-center justify-between`}
            >
                <span className={selected ? "text-gray-900" : "text-gray-400"}>
                    {selected || placeholder}
                </span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={20} className="text-gray-500 ml-2" />
                </motion.div>
            </div>

            <AnimatePresence>
                {isOpen && !disabled && (
                    <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-10 left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                    >
                        {options.map((opt, idx) => (
                            <li
                                key={idx}
                                onClick={() => {
                                    onSelect(opt);
                                    setIsOpen(false);
                                }}
                                className="px-4 py-2 hover:bg-green-100 cursor-pointer"
                            >
                                {opt}
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};

const BeARider = () => {
    const { user } = useContext(AuthContext);
    const serviceCenters = useLoaderData();
    const axiosSecure = useAxiosSecure();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
    } = useForm();

    const regions = [...new Set(serviceCenters.map((s) => s.region))];
    const [selectedRegion, setSelectedRegion] = useState("");
    const districts = serviceCenters
        .filter((s) => s.region === selectedRegion)
        .map((s) => s.district);
    const [selectedDistrict, setSelectedDistrict] = useState("");

    const handleRegionSelect = (region) => {
        setSelectedRegion(region);
        setSelectedDistrict("");
        setValue("region", region);
        setValue("district", "");
    };

    const handleDistrictSelect = (district) => {
        setSelectedDistrict(district);
        setValue("district", district);
    };

    const onSubmit = async (data) => {
        const riderData = {
            ...data,
            status: "pending",
            created_at: new Date().toISOString(),
        };

        try {
            const res = await axiosSecure.post("/riders", riderData);
            if (res.data.insertedId) {
                Swal.fire({
                    icon: "success",
                    title: "Application Submitted!",
                    text: "Your application is pending approval.",
                });
                reset();
                setSelectedRegion("");
                setSelectedDistrict("");
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Submission Failed",
                text: error.message || "Something went wrong!",
            });
        }
    };

    return (
        <div className="max-w-[1800px] w-full mx-auto py-4 px-2 md:px-6 lg:px-12">
            <div className="mx-auto bg-white rounded-3xl shadow-lg">
                <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
                    {/* Left - Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-800">Be a Rider</h1>
                            <p className="text-slate-600 text-lg leading-relaxed">
                                Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle.
                                From personal packages to business shipments — we deliver on time, every time.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold text-slate-800">Tell us about yourself</h2>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Name (editable) */}
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-slate-700 font-medium">Your Name</label>
                                        <input
                                            id="name"
                                            type="text"
                                            placeholder="Your Name"
                                            defaultValue={user?.displayName || ""}
                                            {...register("name", { required: true })}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                                        />
                                        {errors.name && (
                                            <span className="text-red-500 text-sm">Name is required</span>
                                        )}
                                    </div>

                                    {/* Email (editable) */}
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-slate-700 font-medium">Your Email</label>
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="Your Email"
                                            defaultValue={user?.email || ""}
                                            {...register("email", { required: true })}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                                        />
                                        {errors.email && (
                                            <span className="text-red-500 text-sm">Email is required</span>
                                        )}
                                    </div>

                                    {/* Age */}
                                    <div className="space-y-2">
                                        <label htmlFor="age" className="text-slate-700 font-medium">Your Age</label>
                                        <input
                                            id="age"
                                            type="number"
                                            placeholder="Your Age"
                                            {...register("age", { required: true, min: 18 })}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                                        />
                                        {errors.age && (
                                            <span className="text-red-500 text-sm">You must be 18 or older</span>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="text-slate-700 font-medium">Phone Number</label>
                                        <input
                                            id="phone"
                                            type="tel"
                                            placeholder="Phone Number"
                                            {...register("phone", { required: true })}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                                        />
                                        {errors.phone && (
                                            <span className="text-red-500 text-sm">Phone number is required</span>
                                        )}
                                    </div>

                                    {/* NID */}
                                    <div className="space-y-2">
                                        <label htmlFor="nid" className="text-slate-700 font-medium">National ID Card Number</label>
                                        <input
                                            id="nid"
                                            type="text"
                                            placeholder="National ID Card Number"
                                            {...register("nid", { required: true })}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                                        />
                                        {errors.nid && (
                                            <span className="text-red-500 text-sm">NID is required</span>
                                        )}
                                    </div>

                                    {/* Region Dropdown */}
                                    <div className="space-y-2">
                                        <Dropdown
                                            label="Your Region"
                                            options={regions}
                                            selected={selectedRegion}
                                            onSelect={handleRegionSelect}
                                            placeholder="Select your region"
                                            disabled={regions.length === 0}
                                        />
                                        {errors.region && (
                                            <span className="text-red-500 text-sm">Region is required</span>
                                        )}
                                    </div>

                                    {/* District Dropdown */}
                                    <div className="space-y-2">
                                        <Dropdown
                                            label="Your District"
                                            options={districts}
                                            selected={selectedDistrict}
                                            onSelect={handleDistrictSelect}
                                            placeholder="Select your district"
                                            disabled={!selectedRegion || districts.length === 0}
                                        />
                                        {errors.district && (
                                            <span className="text-red-500 text-sm">District is required</span>
                                        )}
                                    </div>

                                    {/* Bike Brand */}
                                    <div className="space-y-2">
                                        <label htmlFor="bike_brand" className="text-slate-700 font-medium">Bike Brand</label>
                                        <input
                                            id="bike_brand"
                                            type="text"
                                            placeholder="Bike Brand (e.g., Yamaha FZ)"
                                            {...register("bike_brand", { required: true })}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                                        />
                                        {errors.bike_brand && (
                                            <span className="text-red-500 text-sm">Bike brand is required</span>
                                        )}
                                    </div>

                                    {/* Bike Registration */}
                                    <div className="space-y-2">
                                        <label htmlFor="bike_registration" className="text-slate-700 font-medium">Bike Registration Number</label>
                                        <input
                                            id="bike_registration"
                                            type="text"
                                            placeholder="Bike Registration Number"
                                            {...register("bike_registration", { required: true })}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                                        />
                                        {errors.bike_registration && (
                                            <span className="text-red-500 text-sm">Registration number is required</span>
                                        )}
                                    </div>
                                </div>

                                {/* Additional Info */}
                                <div className="space-y-2">
                                    <label htmlFor="note" className="text-slate-700 font-medium">Additional Information (optional)</label>
                                    <textarea
                                        id="note"
                                        placeholder="Additional information (optional)"
                                        {...register("note")}
                                        rows={4}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-green-400 hover:bg-green-500 text-slate-800 font-semibold py-3 rounded-lg text-lg transition"
                                >
                                    Submit Rider Application
                                </button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Right - Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center justify-center"
                    >
                        <div className="w-full max-w-md">
                            <img src={riderImg} alt="Delivery rider" className="w-full h-auto rounded-xl" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default BeARider;
