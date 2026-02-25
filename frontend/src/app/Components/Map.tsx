"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer,TileLayer, Marker, Popup, useMap,} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { IoMdSpeedometer } from "react-icons/io";
import { FaMapMarkerAlt, FaBatteryHalf, FaRoad, FaTruck } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";

interface Vehicle {
  vehicleNo: string;
  entityName: string;
  latitude: number;
  longitude: number;
  ignition: string;
  speed: number;
  location: string;
  timestamp: string;
  distance: number;
  battery: number;
}

/* ---------------- CUSTOM ICON ---------------- */

const carIcon = new L.Icon({
  iconUrl:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_1YvSqKzcZwY7N9b7s7GYA3uog2Bzbr4-cQ&s",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

/* ---------------- AUTO CENTER ---------------- */

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 15, { duration: 1.5 });
  }, [center, map]);
  return null;
}

/* ---------------- MAIN COMPONENT ---------------- */

export default function Map() {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [input, setInput] = useState("");
  const [searchedVehicle, setSearchedVehicle] = useState("");
  const [center, setCenter] = useState<[number, number]>([0, 0]);
  const [loading, setLoading] = useState(false);

  const fetchVehicle = async (vehicleNo: string) => {
    try {
      setLoading(true);
      setNotFound(false);

      const response = await axios.post(
        "https://etranssolutions.com/eTransRestApi/reports/location",
        [vehicleNo],
        {
          headers: {
            "Content-Type": "application/json",
            username: "SHREERADHE",
            password: "bjEW6sDhsyo1wH3",
          },
        }
      );

      const data = response.data?.result?.[0];
console.log("API Response:", data);
      if (data) {
        const lat = Number(data.latitude);
        const lng = Number(data.longitude);

        if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
          setVehicle({
            ...data,
            latitude: lat,
            longitude: lng,
            distance: Number(data.distance),
            battery: Number(data.battery),
            speed: Number(data.speed),
          });
          setCenter([lat, lng]);
        } else {
          setVehicle(null);
          setNotFound(true);
        }
      } else {
        setVehicle(null);
        setNotFound(true);
      }
    } catch {
      setVehicle(null);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const vehicleRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{1,3}[0-9]{4}$/;
    const formatted = input.trim().toUpperCase();
    if (!formatted) return
      if (!vehicleRegex.test(formatted)) {
    alert("Invalid vehicle number format (Example: MH12AB1234)");
    return;
  }
    setSearchedVehicle(formatted);
    fetchVehicle(formatted);
  };

  /* Auto Refresh After Search */
  useEffect(() => {
    if (!searchedVehicle) return;

    const interval = setInterval(() => {
      fetchVehicle(searchedVehicle);
    }, 30000);

    return () => clearInterval(interval);
  }, [searchedVehicle]);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* SEARCH BAR */}
      <div className="flex justify-center items-center p-6 gap-3 bg-white shadow-md max-w2xl ">
      
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter Vehicle Number"
          className="border p-3 rounded w-80  bg-w focus:outline-none focus:ring-2 focus:ring-red-800"
        />
        <button
          onClick={handleSearch}
          className="bg-red-800 text-white px-6 py-3 rounded"
        >
          Search
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center mt-6 text-red-600 font-semibold">
          Loading vehicle data...
        </div>
      )}

      {/* NOT FOUND */}
      {notFound && (
        <div className="text-center mt-6 text-red-800 font-bold text-xl">
           Vehicle Not Found
        </div>
      )}

      {/* SHOW DATA + MAP ONLY IF VEHICLE FOUND */}
      {vehicle && (
        <>
          <h1 className="text-center text-3xl font-bold text-white bg-red-800 py-4 ">
            🚚 Live Vehicle Tracking
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-5">

            {/* DETAILS */}
            <div className="col-span-2 bg-gray-50 p-6 overflow-y-auto">
              <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">

                <p><FaTruck className="inline text-blue-600" /> <b>Vehicle:</b> {vehicle.vehicleNo}</p>
                <p><FaRoad className="inline text-purple-600" /> <b>Entity:</b> {vehicle.entityName}</p>
                <p><IoMdSpeedometer className="inline text-green-600" /> <b>Speed:</b> {vehicle.speed} km/h</p>
                <p><FaBatteryHalf className="inline text-green-600" /> <b>Battery:</b> {vehicle.battery}%</p>
                <p><FaMapMarkerAlt className="inline text-red-600" /> <b>Location:</b> {vehicle.location}</p>
                <p><MdAccessTime className="inline text-gray-600" /> <b>Last Update:</b> {vehicle.timestamp}</p>

              </div>
            </div>

            {/* MAP */}
            <div className="col-span-3 h-[80vh]" >
              <MapContainer
                center={center}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <ChangeView center={center} />

                <Marker position={center} icon={carIcon}>
                  <Popup>
                    🚚 {vehicle.vehicleNo} <br />
                     {vehicle.location}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>

          </div>
        </>
      )}
    </div>
  );
}