import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
  const route = [
    [51.505, -0.09],
    [51.51, -0.1],
  ];

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline positions={route} />
      <Marker position={[51.505, -0.09]}>
        <Popup>Start</Popup>
      </Marker>
      <Marker position={[51.51, -0.1]}>
        <Popup>End</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;