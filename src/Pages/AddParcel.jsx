import React, { useContext, useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useLoaderData } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import useAxiosSecure from "../Provider/useAxiosSecure";
import { AuthContext } from "../Provider/AuthProvider";

const generateTrackingID = () => {
    const date = new Date();
    const datePart = date.toISOString().split("T")[0].replace(/-/g, "");
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `PCL-${datePart}-${rand}`;
};

// Container animation variants
const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
};

// Item animation variants
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.3, duration: 0.65 },
    }),
};


// CustomDropdown component
const CustomDropdown = ({
    label,
    options,
    value,
    onChange,
    placeholder,
    disabled,
    name,
    id,
}) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    // Close dropdown if click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Selected label text
    const selectedLabel = options.find((opt) => opt.value === value)?.label;

    return (
        <div className="relative" ref={containerRef}>
            <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-700 mb-2"
            >
                {label}
            </label>
            <button
                type="button"
                id={id}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => !disabled && setOpen((v) => !v)}
                disabled={disabled}
                className={`w-full text-left px-4 py-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:outline-none transition-all flex justify-between items-center ${disabled ? "cursor-not-allowed bg-gray-100 text-gray-400" : "cursor-pointer"
                    }`}
            >
                <span>{selectedLabel || placeholder}</span>
                <svg
                    className={`w-5 h-5 ml-2 transition-transform ${open ? "rotate-180" : ""
                        }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        role="listbox"
                        aria-labelledby={id}
                        tabIndex={-1}
                        className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white border border-gray-200 shadow-lg focus:outline-none"
                    >
                        {options.length === 0 && (
                            <li
                                className="cursor-default select-none py-2 px-4 text-gray-400"
                                aria-disabled="true"
                            >
                                No options
                            </li>
                        )}
                        {options.map(({ value: optValue, label: optLabel }) => (
                            <li
                                key={optValue}
                                role="option"
                                aria-selected={optValue === value}
                                className={`cursor-pointer select-none py-2 px-4 hover:bg-green-100 ${optValue === value ? "bg-green-200 font-semibold" : ""
                                    }`}
                                onClick={() => {
                                    onChange(optValue);
                                    setOpen(false);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        onChange(optValue);
                                        setOpen(false);
                                    }
                                }}
                                tabIndex={0}
                            >
                                {optLabel}
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};

const AddParcel = () => {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            type: "document",
            weight: "",
            sender_region: "",
            sender_center: "",
            receiver_region: "",
            receiver_center: "",
        },
    });

    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const serviceCenters = useLoaderData();
    const uniqueRegions = [...new Set(serviceCenters.map((w) => w.region))];

    const getDistrictsByRegion = (region) =>
        serviceCenters.filter((w) => w.region === region).map((w) => w.district);

    const parcelType = watch("type");
    const senderRegion = watch("sender_region");
    const receiverRegion = watch("receiver_region");

    // Reset wirehouse when region changes
    useEffect(() => {
        setValue("sender_center", "");
    }, [senderRegion, setValue]);

    useEffect(() => {
        setValue("receiver_center", "");
    }, [receiverRegion, setValue]);

    const onSubmit = (data) => {
        const weight = parseFloat(data.weight) || 0;
        const isSameDistrict = data.sender_center === data.receiver_center;

        let baseCost = 0;
        let extraCost = 0;
        let breakdown = "";

        if (data.type === "document") {
            baseCost = isSameDistrict ? 60 : 80;
            breakdown = `Document delivery ${isSameDistrict ? "within" : "outside"} the district.`;
        } else {
            if (weight <= 3) {
                baseCost = isSameDistrict ? 110 : 150;
                breakdown = `Non-document up to 3kg ${isSameDistrict ? "within" : "outside"} the district.`;
            } else {
                const extraKg = weight - 3;
                const perKgCharge = extraKg * 40;
                const districtExtra = isSameDistrict ? 0 : 40;
                baseCost = isSameDistrict ? 110 : 150;
                extraCost = perKgCharge + districtExtra;

                breakdown = `
          Non-document over 3kg ${isSameDistrict ? "within" : "outside"} the district.<br/>
          Extra charge: ৳40 x ${extraKg.toFixed(1)}kg = ৳${perKgCharge}<br/>
          ${districtExtra ? "+ ৳40 extra for outside district delivery" : ""}
        `;
            }
        }

        const totalCost = baseCost + extraCost;

        Swal.fire({
            title: "Delivery Cost Breakdown",
            icon: "info",
            html: `
              <div class="text-left text-base rounded-lg space-y-3 leading-relaxed">
                <div class="space-y-1">
                  <p><strong class="text-gray-700">Parcel Type:</strong> <span class="text-gray-900">${data.type}</span></p>
                  <p><strong class="text-gray-700">Weight:</strong> <span class="text-gray-900">${weight} kg</span></p>
                  <p><strong class="text-gray-700">Delivery Zone:</strong> <span class="text-gray-900">${isSameDistrict ? "Within Same District" : "Outside District"}</span></p>
                </div>
                
                <hr class="my-2 border-gray-300"/>
                
                <div class="space-y-1">
                  <p><strong class="text-gray-700">Base Cost:</strong> <span class="text-gray-900">৳${baseCost}</span></p>
                  ${extraCost > 0 ? `<p><strong class="text-gray-700">Extra Charges:</strong> <span class="text-red-600">৳${extraCost}</span></p>` : ""}
                  <p class="text-sm text-gray-500 italic">${breakdown}</p>
                </div>
          
                <hr class="my-2 border-gray-300"/>
          
                <p class="text-2xl font-semibold text-green-600">Total Cost: ৳${totalCost}</p>
              </div>
            `,
            showDenyButton: true,
            confirmButtonText: "💳 Proceed to Payment",
            denyButtonText: "✏️ Continue Editing",
            confirmButtonColor: "#16a34a",
            denyButtonColor: "#9ca3af",
            customClass: {
                popup: "rounded-2xl shadow-lg px-8 py-6 font-sans",
                confirmButton: "text-white font-semibold",
                denyButton: "text-gray-700 font-semibold",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                const parcelData = {
                    ...data,
                    cost: totalCost,
                    created_by: user.email,
                    payment_status: "unpaid",
                    delivery_status: "not_collected",
                    creation_date: new Date().toISOString(),
                    tracking_id: generateTrackingID(),
                };

                axiosSecure.post("/parcels", parcelData).then((res) => {
                    if (res.data.insertedId) {
                        Swal.fire({
                            title: "Redirecting...",
                            text: "Proceeding to payment gateway.",
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false,
                        });
                    }
                });
            }
        });
    };

    // Prepare options for dropdowns
    const regionOptions = uniqueRegions.map((r) => ({ label: r, value: r }));
    const senderWireHouses = senderRegion ? getDistrictsByRegion(senderRegion) : [];
    const receiverWireHouses = receiverRegion ? getDistrictsByRegion(receiverRegion) : [];
    const senderWireOptions = senderWireHouses.map((d) => ({ label: d, value: d }));
    const receiverWireOptions = receiverWireHouses.map((d) => ({ label: d, value: d }));

    return (
        <motion.div
            className="min-h-screen max-w-[1800px] w-full mx-auto py-4 px-2 md:px-6 lg:px-12"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div className="mx-auto bg-white rounded-2xl shadow-lg p-8" variants={itemVariants}>
                <motion.h1 className="text-3xl font-bold text-gray-800 mb-2" variants={itemVariants}>
                    Add Parcel
                </motion.h1>
                <motion.p className="text-gray-600 mb-8" variants={itemVariants}>
                    Enter your parcel details
                </motion.p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Parcel Type Radio Buttons */}
                    <motion.div className="flex gap-6 mb-6" variants={itemVariants} layout>
                        {["document", "non-document"].map((type) => (
                            <motion.label
                                key={type}
                                className="flex items-center cursor-pointer select-none"
                                layout
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <input
                                    type="radio"
                                    value={type}
                                    {...register("type", { required: true })}
                                    className="sr-only"
                                    checked={parcelType === type}
                                    readOnly
                                />
                                <motion.div
                                    className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${parcelType === type
                                        ? "border-green-500 bg-green-500"
                                        : "border-gray-300"
                                        }`}
                                    layout
                                    transition={{ type: "spring", stiffness: 700, damping: 30 }}
                                >
                                    {parcelType === type && (
                                        <motion.div className="w-2 h-2 rounded-full bg-white" layoutId="selectedCircle" />
                                    )}
                                </motion.div>
                                <span className="text-gray-700 font-medium">
                                    {type === "document" ? "Document" : "Non-Document"}
                                </span>
                            </motion.label>
                        ))}
                    </motion.div>

                    {/* Parcel Name & Weight */}
                    <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" variants={itemVariants} layout>
                        <motion.div variants={itemVariants} layout>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Parcel Name</label>
                            <input
                                {...register("title", { required: "Parcel Name is required" })}
                                placeholder="Parcel Name"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                            />
                        </motion.div>

                        <AnimatePresence>
                            {parcelType === "non-document" && (
                                <motion.div
                                    variants={itemVariants}
                                    layout
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Parcel Weight (KG)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        {...register("weight", {
                                            required:
                                                parcelType === "non-document"
                                                    ? "Weight is required for non-document"
                                                    : false,
                                            valueAsNumber: true,
                                        })}
                                        placeholder="Parcel Weight (KG)"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Sender & Receiver Details */}
                    <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-8" variants={itemVariants} layout>
                        {/* Sender */}
                        <motion.div variants={itemVariants} layout>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Sender Details</h3>

                            <motion.div className="space-y-4" variants={itemVariants}>
                                <motion.div variants={itemVariants} layout>
                                    <input
                                        {...register("sender_name")}
                                        defaultValue={user.displayName}
                                        placeholder="Sender Name"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                    />
                                </motion.div>

                                <motion.div variants={itemVariants} layout>
                                    <input
                                        {...register("sender_address")}
                                        placeholder="Sender Address"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                    />
                                </motion.div>

                                <motion.div variants={itemVariants} layout>
                                    <input
                                        {...register("sender_contact")}
                                        placeholder="Sender Contact No"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                    />
                                </motion.div>

                                <motion.div variants={itemVariants} layout>
                                    <CustomDropdown
                                        label="Sender Region"
                                        options={regionOptions}
                                        value={senderRegion}
                                        onChange={(val) => setValue("sender_region", val)}
                                        placeholder="Select your region"
                                        name="sender_region"
                                        id="sender_region"
                                    />
                                </motion.div>

                                <motion.div variants={itemVariants} layout>
                                    <CustomDropdown
                                        label="Sender Wirehouse"
                                        options={senderWireOptions}
                                        value={watch("sender_center")}
                                        onChange={(val) => setValue("sender_center", val)}
                                        placeholder="Select Wire house"
                                        disabled={!senderRegion}
                                        name="sender_center"
                                        id="sender_center"
                                    />
                                </motion.div>

                                <motion.div variants={itemVariants} layout>
                                    <textarea
                                        {...register("pickup_instruction")}
                                        placeholder="Pickup Instruction"
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                                    />
                                </motion.div>
                            </motion.div>
                        </motion.div>

                        {/* Receiver */}
                        <motion.div variants={itemVariants} layout>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Receiver Details</h3>

                            <motion.div className="space-y-4" variants={itemVariants}>
                                {[
                                    { name: "receiver_name", placeholder: "Receiver Name" },
                                    { name: "receiver_address", placeholder: "Receiver Address" },
                                    { name: "receiver_contact", placeholder: "Receiver Contact No" },
                                ].map(({ name, placeholder }) => (
                                    <motion.div key={name} variants={itemVariants} layout>
                                        <input
                                            {...register(name)}
                                            placeholder={placeholder}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </motion.div>
                                ))}

                                <motion.div variants={itemVariants} layout>
                                    <CustomDropdown
                                        label="Receiver Region"
                                        options={regionOptions}
                                        value={receiverRegion}
                                        onChange={(val) => setValue("receiver_region", val)}
                                        placeholder="Select your region"
                                        name="receiver_region"
                                        id="receiver_region"
                                    />
                                </motion.div>

                                <motion.div variants={itemVariants} layout>
                                    <CustomDropdown
                                        label="Receiver Wirehouse"
                                        options={receiverWireOptions}
                                        value={watch("receiver_center")}
                                        onChange={(val) => setValue("receiver_center", val)}
                                        placeholder="Select Wire house"
                                        disabled={!receiverRegion}
                                        name="receiver_center"
                                        id="receiver_center"
                                    />
                                </motion.div>

                                <motion.div variants={itemVariants} layout>
                                    <textarea
                                        {...register("delivery_instruction")}
                                        placeholder="Delivery Instruction"
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                                    />
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Pickup time note */}
                    <motion.div className="mt-6" variants={itemVariants}>
                        <p className="text-sm text-gray-600">* Pickup Time 4pm-7pm Approx.</p>
                    </motion.div>

                    {/* Submit button */}
                    <motion.div className="mt-8" variants={itemVariants}>
                        <button
                            type="submit"
                            className="bg-[#CAEB66] hover:bg-[#bbd274] cursor-pointer text-gray-800 font-semibold py-4 px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            Proceed to Confirm Booking
                        </button>
                    </motion.div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default AddParcel;
