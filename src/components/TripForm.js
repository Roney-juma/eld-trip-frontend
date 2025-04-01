import React, { useState } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const TripForm = ({ formData, setFormData }) => {
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const navigate = useNavigate();

  // Fetch location suggestions from OpenStreetMap
  const fetchLocations = async (query, type) => {
    if (!query) return;
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
      );

      if (type === "pickup") {
        setPickupSuggestions(response.data);
      } else {
        setDropoffSuggestions(response.data);
      }
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

  // Handle selecting a location
  const handleLocationSelect = (type, location) => {
    if (type === "pickup") {
      setFormData({
        ...formData,
        pickup_location_name: location.display_name,
        pickup_latitude: parseFloat(location.lat),
        pickup_longitude: parseFloat(location.lon),
      });
      setPickupSuggestions([]);
    } else {
      setFormData({
        ...formData,
        dropoff_location_name: location.display_name,
        dropoff_latitude: parseFloat(location.lat),
        dropoff_longitude: parseFloat(location.lon),
      });
      setDropoffSuggestions([]);
    }
  };

  // Send trip data to API
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/trips/",
        formData
      );
      navigate("/#map");
      setTimeout(() => {
        const element = document.getElementById("map");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
      console.log("Trip Created:", response.data);
      toast.success("Trip successfully created!");
      // alert("Trip successfully created!");
    } catch (error) {
      console.error("Error creating trip:", error);
      // alert("Failed to create trip. Please try again.");
      toast.error("Failed to create trip. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 shadow-lg rounded-lg w-full">
      <h2 className="text-2xl font-bold text-center mb-4">Plan Your Trip</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative"
      >
        {/* Pickup Location */}
        <div className="relative">
          <label className="font-medium">Pickup Location</label>
          <input
            type="text"
            className="w-full p-3 border rounded mt-1 focus:ring-2 focus:ring-blue-500"
            placeholder="Type to search..."
            value={formData.pickup_location_name}
            onChange={(e) => {
              setFormData({
                ...formData,
                pickup_location_name: e.target.value,
              });
              fetchLocations(e.target.value, "pickup");
            }}
          />
          {pickupSuggestions.length > 0 && (
            <ul className="absolute left-0 right-0 bg-white border rounded mt-1 max-h-40 overflow-y-auto shadow-lg z-10">
              {pickupSuggestions.map((loc) => (
                <li
                  key={loc.place_id}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleLocationSelect("pickup", loc)}
                >
                  {loc.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Dropoff Location */}
        <div className="relative">
          <label className="font-medium">Dropoff Location</label>
          <input
            type="text"
            className="w-full p-3 border rounded mt-1 focus:ring-2 focus:ring-blue-500"
            placeholder="Type to search..."
            value={formData.dropoff_location_name}
            onChange={(e) => {
              setFormData({
                ...formData,
                dropoff_location_name: e.target.value,
              });
              fetchLocations(e.target.value, "dropoff");
            }}
          />
          {dropoffSuggestions.length > 0 && (
            <ul className="absolute left-0 right-0 bg-white border rounded mt-1 max-h-40 overflow-y-auto shadow-lg z-10">
              {dropoffSuggestions.map((loc) => (
                <li
                  key={loc.place_id}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleLocationSelect("dropoff", loc)}
                >
                  {loc.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Current Cycle Used */}
        <div className="col-span-1 sm:col-span-2">
          <label className="font-medium">Current Cycle Used (hours)</label>
          <input
            type="number"
            className="w-full p-3 border rounded mt-1"
            placeholder="Enter cycle hours used"
            value={formData.current_cycle_used}
            onChange={(e) =>
              setFormData({ ...formData, current_cycle_used: e.target.value })
            }
          />
        </div>

        {/* Submit Button */}
        <div className="col-span-1 sm:col-span-2 flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
          >
            Plan Trip
          </button>
        </div>
      </form>
    </div>
  );
};

export default TripForm;
