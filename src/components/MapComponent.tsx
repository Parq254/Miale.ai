import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

type MapComponentProps = {
  latitude?: number;
  longitude?: number;
};

const MapComponent: React.FC<MapComponentProps> = ({ latitude, longitude }) => {
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    if (map && latitude && longitude) {
      map.setView([latitude, longitude], 15); // Center the map
      map.invalidateSize(); // Force the map to recalculate its size
    }
  }, [latitude, longitude, map]);

  if (!latitude || !longitude) {
    return (
      <div className="h-96 w-full flex items-center justify-center">
        <p>Loading map...</p>
      </div>
    );
  }

  return (
    <div className="h-96 w-full rounded overflow-hidden shadow-sm">
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        scrollWheelZoom={true}
        className="h-full w-full"
        whenCreated={setMap}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[latitude, longitude]}>
          <Popup>
            You are here! <br /> Latitude: {latitude}, Longitude: {longitude}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;