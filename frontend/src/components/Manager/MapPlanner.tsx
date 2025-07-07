import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  LayersControl,
  Tooltip,
  GeoJSON,
} from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL(
    "leaflet/dist/images/marker-icon-2x.png",
    import.meta.url,
  ).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url)
    .href,
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
            Math.abs(lat - e.latlng.lat) > 1e-6 ||
            Math.abs(lng - e.latlng.lng) > 1e-6,
        ),
      );
    },
  });

  return null;
};

const MapPlanner = () => {
  const [points, setPoints] = useState<[number, number][]>([]);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [routeGeoJson, setRouteGeoJson] = useState<null>(null);
  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const response = await fetch("http://localhost:6868/routeTrail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ points }),
        });

        if (!response.ok) {
          const err = await response.json();
          console.warn("Błąd ORS:", err.error || "nieznany");
          return;
        }

        const data = await response.json();
        setRouteGeoJson(data);
      } catch (err) {
        console.error("Błąd sieci:", err);
      }
    };

    if (points.length >= 2) {
      fetchRoute();
    } else {
      setRouteGeoJson(null); 
    }
  }, [points]);

  return (
    <div className="w-full h-full flex flex-col">
      <MapContainer
        center={[49.29, 19.95]}
        zoom={12}
        scrollWheelZoom
        className="w-full h-full"
      >
        <LayersControl position="topright">
          <BaseLayer checked name="MapTiler Outdoor">
            <TileLayer
              url="https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}.png?key=rhB0XJ5Y8vgPLieD126O"
              attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a>'
              tileSize={512}
              zoomOffset={-1}
            />
          </BaseLayer>

          <Overlay name="Szlaki turystyczne (Waymarked Trails)">
            <TileLayer
              url="https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png"
              attribution="&copy; Waymarked Trails"
              opacity={0.8}
            />
          </Overlay>
          <Overlay name="Cieniowanie terenu (hillshade)">
            <TileLayer
              url="https://api.maptiler.com/tiles/hillshade/{z}/{x}/{y}.webp?key=rhB0XJ5Y8vgPLieD126O"
              attribution="&copy; MapTiler"
              tileSize={512}
              opacity={0.35}
            />
          </Overlay>
          <Overlay name="Kontury wysokości (contours)">
            <TileLayer
              url="https://api.maptiler.com/tiles/contours-v2/{z}/{x}/{y}.pbf?key=rhB0XJ5Y8vgPLieD126O"
              attribution="&copy; MapTiler"
              tileSize={512}
              opacity={0.5}
            />
          </Overlay>
        </LayersControl>

        <LocationMarker setPoints={setPoints} />
        <LocationMarkerDelete setPoints={setPoints} />

        {points.map((pos, idx) => (
          <Marker
            key={idx}
            position={pos}
            eventHandlers={{
              mouseover: () => setHoveredPoint(idx),
              mouseout: () => setHoveredPoint(null),
              contextmenu: () => {
                setPoints(points.filter((_, i) => i !== idx));
              },
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

        {routeGeoJson && (
          <GeoJSON data={routeGeoJson} style={{ color: "red", weight: 4 }} />
        )}
      </MapContainer>
    </div>
  );
};

export default MapPlanner;
