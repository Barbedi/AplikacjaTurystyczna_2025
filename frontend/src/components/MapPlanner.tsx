import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).href,
});

const LocationMarker = ({ setPoints }: { setPoints: React.Dispatch<React.SetStateAction<[number, number][]>> }) => {
  useMapEvents({
    click(e) {
      setPoints((prev) => [...prev, [e.latlng.lat, e.latlng.lng]]);
    },
  });
  return null;
};

const MapPlanner = () => {
  const [points, setPoints] = useState<[number, number][]>([]);

  return (
    <div className="w-full h-full">
      <MapContainer
        center={[49.29, 19.95]}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          
        />
        <TileLayer
    url="https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png"
    attribution='&copy; Waymarked Trails'
  />
        <LocationMarker setPoints={setPoints} />
        {points.map((pos, idx) => (
          <Marker key={idx} position={pos} />
        ))}
      </MapContainer>
    </div>
  );
};

export default MapPlanner;
