import { MapContainer, TileLayer, Marker, useMapEvents, LayersControl, Tooltip } from "react-leaflet";
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

const { BaseLayer, Overlay } = LayersControl;

const LocationMarker = ({
  setPoints,
}: {
  setPoints: React.Dispatch<React.SetStateAction<[number, number][]>>;
}) => {
  useMapEvents({
    click(e) {
      setPoints((prev) => [...prev, [e.latlng.lat, e.latlng.lng]]);
    },
  });
  return null;
};

const LocationMarkerDelete = ({
    setPoints,
}: {
    setPoints: React.Dispatch<React.SetStateAction<[number, number][]>>;
}) => {
    useMapEvents({
        contextmenu(e) {
            setPoints((prev) =>
                prev.filter(
                    ([lat, lng]) =>
                        Math.abs(lat - e.latlng.lat) > 1e-6 || Math.abs(lng - e.latlng.lng) > 1e-6
                )
            );
        },
    });
    
    return null;
};

const MapPlanner = () => {
  const [points, setPoints] = useState<[number, number][]>([]);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  return (
    <div className="w-full h-full">
      <MapContainer center={[49.29, 19.95]} zoom={12} scrollWheelZoom className="w-full h-full">
        <LayersControl position="topright">
          <BaseLayer checked name="MapTiler Outdoor">
            <TileLayer
              url="https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}.png?key=rhB0XJ5Y8vgPLieD126O"
              attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a>'
              tileSize={512}
              zoomOffset={-1}
            />
          </BaseLayer>

          <Overlay checked name="Szlaki turystyczne (Waymarked Trails)">
            <TileLayer
              url="https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png"
              attribution='&copy; Waymarked Trails'
              opacity={0.8}
            />
          </Overlay>
          <Overlay name="Cieniowanie terenu (hillshade)">
            <TileLayer
                url="https://api.maptiler.com/tiles/hillshade/{z}/{x}/{y}.webp?key=rhB0XJ5Y8vgPLieD126O"
                attribution="&copy; MapTiler"
                opacity={0.35}
            />
            </Overlay>
            <Overlay name="Kontury wysokości (contours)">
            <TileLayer
                url="https://api.maptiler.com/tiles/contours-v2/{z}/{x}/{y}.pbf?key=rhB0XJ5Y8vgPLieD126O"
                attribution="&copy; MapTiler"
                opacity={0.5}
            />
            </Overlay>
        </LayersControl>
        <LocationMarker setPoints={setPoints} />
        {points.map((pos, idx) => (
          <Marker 
            key={idx} 
            position={pos}
            eventHandlers={{
              mouseover: () => setHoveredPoint(idx),
              mouseout: () => setHoveredPoint(null),
              contextmenu: () => {
                setPoints(points.filter((_, i) => i !== idx));
              }
            }}
          >
            {hoveredPoint === idx && (
              <Tooltip permanent direction="top" offset={[0, -30]}>
                Kliknij prawym przyciskiem, aby usunąć
                <br />
                {`Współrzędne: ${pos[0].toFixed(5)}, ${pos[1].toFixed(5)}`}
              </Tooltip>
            )}
          </Marker>
        ))}
        <LocationMarkerDelete setPoints={setPoints} />
      </MapContainer>
    </div>
  );
};

export default MapPlanner;
