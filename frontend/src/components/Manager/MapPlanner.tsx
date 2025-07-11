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
import { Shelters } from "../../assets/Data";
import SheltersMap from "./PopupShelters";
import PlannerDashboard from "./PlannerDashboard";

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

const { BaseLayer } = LayersControl;

const LocationMarker = ({
  addPoint,
}: {
  addPoint: (point: [number, number]) => void;
}) => {
  useMapEvents({
    click(e) {
      addPoint([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const LocationMarkerDelete = ({
  removePointByCoordinates,
}: {
  removePointByCoordinates: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    contextmenu(e) {
      removePointByCoordinates(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const MapPlanner = () => {
  const [points, setPoints] = useState<[number, number][]>([]);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [routeGeoJson, setRouteGeoJson] = useState<any>(null);
  const [shelters, setShelters] = useState<Shelters[]>([]);
  const [hoverPoint, setHoverPoint] = useState<[number, number] | null>(null);

  useEffect(() => {
    fetch("http://localhost:6868/shelters")
      .then((res) => res.json())
      .then((json) => setShelters(json.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const fetchRoute = async (pointsToUse: [number, number][]) => {
      try {
        const response = await fetch("http://localhost:6868/routeTrail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ points: pointsToUse }),
        });

        if (!response.ok) return;
        const data = await response.json();
        setRouteGeoJson(data);
      } catch (err) {
        console.error("Błąd sieci:", err);
      }
    };

    if (points.length >= 2) {
      fetchRoute(points);
    } else {
      setRouteGeoJson(null);
    }
  }, [points]);

  const addPoint = (newPoint: [number, number]) =>
    setPoints((prev) => [...prev, newPoint]);
  const removePoint = (indexToRemove: number) =>
    setPoints((prev) => prev.filter((_, i) => i !== indexToRemove));
  const removePointByCoordinates = (lat: number, lng: number) =>
    setPoints((prev) =>
      prev.filter(
        ([pointLat, pointLng]) =>
          Math.abs(pointLat - lat) > 1e-6 || Math.abs(pointLng - lng) > 1e-6,
      ),
    );
  const addPointAtStart = (newPoint: [number, number]) =>
    setPoints((prev) => [newPoint, ...prev]);
  const addPointAtEnd = (newPoint: [number, number]) =>
    setPoints((prev) => [...prev, newPoint]);

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
        </LayersControl>

        <SheltersMap
          shelters={shelters}
          addPointAtStart={addPointAtStart}
          addPointAtEnd={addPointAtEnd}
        />
        <LocationMarker addPoint={addPoint} />
        <LocationMarkerDelete
          removePointByCoordinates={removePointByCoordinates}
        />

        {points.map((pos, idx) => (
          <Marker
            key={idx}
            position={pos}
            eventHandlers={{
              mouseover: () => setHoveredPoint(idx),
              mouseout: () => setHoveredPoint(null),
              contextmenu: () => removePoint(idx),
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
          <GeoJSON
            key={JSON.stringify(routeGeoJson)}
            data={routeGeoJson}
            style={{ color: "red", weight: 4 }}
          />
        )}
        {hoverPoint && (
          <Marker
            position={hoverPoint}
            icon={L.icon({
              iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
              iconSize: [25, 25],
            })}
          ></Marker>
        )}
      </MapContainer>
      <PlannerDashboard
        visible={points.length >= 2}
        points={points}
        route={routeGeoJson}
        onHoverPoint={(lat, lng) => {
          if (
            typeof lat === "number" &&
            typeof lng === "number" &&
            !isNaN(lat) &&
            !isNaN(lng)
          ) {
            setHoverPoint([lat, lng]);
          } else {
            setHoverPoint(null);
          }
        }}
      />
    </div>
  );
};

export default MapPlanner;
