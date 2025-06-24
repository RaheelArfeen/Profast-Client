import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLoaderData } from 'react-router';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

// Default map center (Bangladesh)
const position = [23.6850, 90.3563];

// Custom icon
const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// Fly to search result
function FlyToDistrict({ coords }) {
    const map = useMap();
    if (coords) map.flyTo(coords, 10, { duration: 1.5 });
    return null;
}

const Coverage = () => {
    const serviceCenters = useLoaderData();
    const [searchText, setSearchText] = useState('');
    const [activeCoords, setActiveCoords] = useState(null);
    const [activeDistrict, setActiveDistrict] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        const district = serviceCenters?.find((d) =>
            d.district.toLowerCase().includes(searchText.toLowerCase())
        );
        if (district) {
            setActiveCoords([district.latitude, district.longitude]);
            setActiveDistrict(district.district);
        }
    };

    if (!Array.isArray(serviceCenters)) {
        return (
            <div className="py-20 text-red-600 font-semibold text-center text-lg">
                Failed to load service center data.
            </div>
        );
    }

    return (
        <motion.div
            className="max-w-[1800px] w-full mx-auto py-6 px-3 md:px-6 lg:px-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <motion.div
                className="bg-white px-4 sm:px-8 md:px-12 py-4 sm:py-10 rounded-2xl shadow-md"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <motion.h1
                    className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#03373D] mb-6"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    We are available in 64 districts
                </motion.h1>

                <div className='border-b border-[#00000010]'>
                    <motion.form
                        onSubmit={handleSearch}
                        className="max-w-xl flex flex-row items-center rounded-full overflow-hidden bg-[#CBD5E150] mb-10 shadow-sm"
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        <div className="relative w-full">
                            <Search className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 text-xl" />
                            <input
                                type="text"
                                placeholder="Search a district here..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 text-base sm:text-lg border-none outline-none bg-transparent"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full sm:w-auto rounded-full bg-[#CAEB66] text-[#1F1F1F] px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold sm:rounded-r-full transition-all"
                        >
                            Search
                        </button>
                    </motion.form>
                </div>

                <motion.div
                    className="h-[500px] sm:h-[600px] md:h-[700px] w-full rounded-xl overflow-hidden mt-6 sm:mt-10"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                >
                    <motion.h2
                        className="text-xl sm:text-2xl md:text-3xl font-bold text-[#03373D] mb-4 sm:mb-6"
                        initial={{ x: -40, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                    >
                        We deliver almost all over Bangladesh
                    </motion.h2>

                    <MapContainer
                        center={position}
                        zoom={8}
                        scrollWheelZoom={false}
                        className="h-full w-full z-0"
                    >
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <FlyToDistrict coords={activeCoords} />

                        {serviceCenters.map((center, index) => (
                            <Marker
                                key={index}
                                position={[center.latitude, center.longitude]}
                                icon={customIcon}
                            >
                                <Popup>
                                    <motion.div
                                        initial={{ scale: 0.7, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.4 }}
                                        className="text-sm"
                                    >
                                        <strong className="text-blue-700">{center.district}</strong>
                                        <br />
                                        <span className="text-gray-600">
                                            {center.covered_area.join(', ')}
                                        </span>
                                    </motion.div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default Coverage;