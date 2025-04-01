import React, { useEffect, useState } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import TripForm from "../components/TripForm";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import background from "../assets/images/background.jpg";

function Home() {
  const [trip, setTrip] = useState(null);
  const [route, setRoute] = useState(null);
  const [locations, setLocations] = useState({
    current_location: { lat: 37.3963, lng: -115.9716 },
    pickup_location: null,
    dropoff_location: null,
  });

  const [formData, setFormData] = useState({
    pickup_location_name: "",
    pickup_latitude: null,
    pickup_longitude: null,
    dropoff_location_name: "",
    dropoff_latitude: null,
    dropoff_longitude: null,
    current_cycle_used: "",
  });

  // Fetch User's Actual Location
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
        (error) => console.error("Geolocation error:", error)
      );
    }
  }, []);

  // Handle Marker Dragging
  const handleMarkerDrag = (key, e) => {
    const { lat, lng } = e.target.getLatLng();
    setLocations((prev) => ({
      ...prev,
      [key]: { lat, lng },
    }));
  };

  // API Call to Create Trip
  const createTrip = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/trips/", {
        current_location: locations.current_location,
        pickup_location: locations.pickup_location,
        dropoff_location: locations.dropoff_location,
        current_cycle_hours_used: 10,
      });

      console.log("Trip API Response:", response.data);
      setTrip(response.data);
      if (response.data.route && response.data.route.routes[0]) {
        setRoute(response.data.route.routes[0].geometry);
      } else {
        console.error("Route data missing in API response");
      }
    } catch (error) {
      console.error("Error creating trip:", error);
    }
  };

  // Define Custom Marker Icons
  const createIcon = (iconUrl) =>
    new L.Icon({
      iconUrl,
      iconSize: [30, 45],
      iconAnchor: [15, 45],
      popupAnchor: [1, -34],
    });

  return (
    <>
      <div className="">
        <div className="min-h-screen relative no-repeat bg-cover bg-center">
          <div className="bg-black/20 absolute inset-0" />
          <img src={background} alt="" className="h-screen w-full" />
        </div>
        <div className="absolute top-1/2  z-[10000] left-1/2 -translate-x-1/2 -translate-y-1/2">
          <TripForm formData={formData} setFormData={setFormData} />
        </div>

        {/* Leaflet Map Display */}
        {formData.pickup_latitude && formData.dropoff_latitude && (
          <div className="mt-6" id="map">
            <MapContainer
              center={[formData.pickup_latitude, formData.pickup_longitude]}
              zoom={10}
              className="h-96 w-full rounded-lg shadow-lg"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {/* Pickup Marker */}
              <Marker
                icon={createIcon(
                  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png"
                )}
                position={[formData.pickup_latitude, formData.pickup_longitude]}
              >
                <Popup>{formData.pickup_location_name}</Popup>
              </Marker>

              {/* Dropoff Marker */}
              <Marker
                icon={createIcon(
                  "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png"
                )}
                position={[
                  formData.dropoff_latitude,
                  formData.dropoff_longitude,
                ]}
              >
                <Popup>{formData.dropoff_location_name}</Popup>
              </Marker>

              {/* Route Line */}
              <Polyline
                positions={[
                  [formData.pickup_latitude, formData.pickup_longitude],
                  [formData.dropoff_latitude, formData.dropoff_longitude],
                ]}
                color="blue"
                weight={5}
              />
            </MapContainer>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
