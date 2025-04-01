"use client"; // Required for Leaflet in Next.js 13+
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const iconUrl = (color) =>
  new L.Icon({
    iconUrl: `https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=•|${color}`,
    iconSize: [30, 50],
    iconAnchor: [15, 45],
  });

const MapComponent = ({ currentLocation, pickupLocation, dropoffLocation }) => {
  const [mapCenter, setMapCenter] = useState([0, 0]); // Default center

  useEffect(() => {
    if (currentLocation) setMapCenter([currentLocation.lat, currentLocation.lng]);
  }, [currentLocation]);

  return (
    <MapContainer center={mapCenter} zoom={6} style={{ height: "400px", width: "100%" }}>
      {/* Map Tiles (Free OpenStreetMap) */}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {/* Current Location */}
      {currentLocation && (
        <Marker position={[currentLocation.lat, currentLocation.lng]} icon={iconUrl("FF0000")} />
      )}

      {/* Pickup Location */}
      {pickupLocation && (
        <Marker position={[pickupLocation.lat, pickupLocation.lng]} icon={iconUrl("008000")} />
      )}

      {/* Dropoff Location */}
      {dropoffLocation && (
        <Marker position={[dropoffLocation.lat, dropoffLocation.lng]} icon={iconUrl("0000FF")} />
      )}

      {/* Route Line */}
      {pickupLocation && dropoffLocation && (
        <Polyline positions={[[pickupLocation.lat, pickupLocation.lng], [dropoffLocation.lat, dropoffLocation.lng]]} color="blue" />
      )}
    </MapContainer>
  );
};

export default MapComponent;
