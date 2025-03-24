import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TripForm from "./components/TripForm";
import MapComponent from "./components/MapComponent";
import LogSheet from "./components/LogSheet";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "./index.css"; // Import the CSS file

function App() {
  // Get user's actual location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocations((prev) => ({
            ...prev,
            current_location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          }));
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);

  const [trip, setTrip] = useState(null);
  const [route, setRoute] = useState(null);
  const [locations, setLocations] = useState({
    current_location: { lat: 37.396346133189255, lng: -115.97167968750001 }, // San Francisco (default) 37.396346133189255, -115.97167968750001
    pickup_location: { lat: 37.77520942774639, lng: -122.42152869701387 }, // Los Angeles (default) 37.77520942774639, -122.42152869701387
    dropoff_location: { lat: 37.77526454959776, lng: -122.42361545562746 }, // New York (default) 37.77526454959776, -122.42361545562746
  });

  // Handle marker drag event
  const handleMarkerDrag = (key, e) => {
    const { lat, lng } = e.target.getLatLng();
    setLocations((prev) => ({
      ...prev,
      [key]: { lat, lng },
    }));
  };

  // API call to create trip
  const createTrip = async () => {
    const response = await axios.post("API_URL", {
      current_location: locations.current_location,
      pickup_location: locations.pickup_location,
      dropoff_location: locations.dropoff_location,
      current_cycle_hours_used: 10,
    });

    setTrip(response.data);
    setRoute(response.data.route.routes[0].geometry);
  };

  // ✅ Define custom marker icons with correct URLs
  const currentLocationIcon = new L.Icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png", // Default blue
    iconSize: [30, 45],
    iconAnchor: [15, 45],
    popupAnchor: [1, -34],
  });

  const pickupLocationIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    iconSize: [30, 45],
    iconAnchor: [15, 45],
    popupAnchor: [1, -34],
  });

  const dropoffLocationIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    iconSize: [30, 45],
    iconAnchor: [15, 45],
    popupAnchor: [1, -34],
  });

  return (
    <>
      <div className="container">
        <h2 className="title">Trip Planner</h2>
        <button className="btn" onClick={createTrip}>
          Plan Trip
        </button>

        {/* Map Display */}
        <MapContainer
          center={locations.current_location}
          zoom={10}
          className="map-container"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Draggable Markers with Fixed Icons */}
          <Marker
            position={locations.current_location}
            draggable={true}
            icon={currentLocationIcon}
            eventHandlers={{
              dragend: (e) => handleMarkerDrag("current_location", e),
            }}
          />
          <Marker
            position={locations.pickup_location}
            draggable={true}
            icon={pickupLocationIcon}
            eventHandlers={{
              dragend: (e) => handleMarkerDrag("pickup_location", e),
            }}
          />
          <Marker
            position={locations.dropoff_location}
            draggable={true}
            icon={dropoffLocationIcon}
            eventHandlers={{
              dragend: (e) => handleMarkerDrag("dropoff_location", e),
            }}
          />

          {/* Draw Route if available */}
          {route && <Polyline positions={route.coordinates} color="blue" />}
        </MapContainer>

        {/* Display Selected Locations */}
        <div className="locations">
          <h3>Selected Locations:</h3>
          <p>
            📍 Current: {locations.current_location.lat},{" "}
            {locations.current_location.lng}
          </p>
          <p>
            🚚 Pickup: {locations.pickup_location.lat},{" "}
            {locations.pickup_location.lng}
          </p>
          <p>
            🏁 Dropoff: {locations.dropoff_location.lat},{" "}
            {locations.dropoff_location.lng}
          </p>
        </div>

        {/* Trip Info */}
        {trip && (
          <div className="trip-info">
            <h3>Trip Details:</h3>
            <p>Trip ID: {trip.trip_id}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
