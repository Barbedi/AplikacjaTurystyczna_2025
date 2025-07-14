import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  LayersControl,
  Tooltip,
  GeoJSON,
  useMap,
} from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Shelters, Peaks, RoutePoint } from "../../assets/Data";
import SheltersMap from "./PopupShelters";
import PlannerDashboard from "./PlannerDashboard";
import PeaksMap from "./PopupPeaks";

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

// Nowy komponent do monitorowania zoom
const ZoomHandler = ({
  onZoomChange,
}: {
  onZoomChange: (zoom: number) => void;
}) => {
  const map = useMap();

  useEffect(() => {
    const handleZoom = () => {
      onZoomChange(map.getZoom());
    };

    map.on("zoomend", handleZoom);
    handleZoom(); // Wywołaj od razu dla aktualnego zoom

    return () => {
      map.off("zoomend", handleZoom);
    };
  }, [map, onZoomChange]);

  return null;
};

const MapPlanner = () => {
  const [points, setPoints] = useState<RoutePoint[]>([]);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [routeGeoJson, setRouteGeoJson] = useState<any>(null);
  const [shelters, setShelters] = useState<Shelters[]>([]);
  const [hoverPoint, setHoverPoint] = useState<[number, number] | null>(null);
  const [peaks, setPeaks] = useState<Peaks[]>([]);
  const [currentZoom, setCurrentZoom] = useState<number>(12);
  const [routeType, setRouteType] = useState<
    "one-way" | "loop" | "back-and-forth"
  >("one-way");

  const ZOOM_LEVELS = {
    PEAKS: 11,
    SHELTERS: 12,
    DETAILS: 14,
  };

  useEffect(() => {
    fetch("http://localhost:6868/shelters")
      .then((res) => res.json())
      .then((json) => setShelters(json.data))
      .catch(console.error);
  }, []);
  useEffect(() => {
    fetch("http://localhost:6868/peaks")
      .then((res) => res.json())
      .then((json) => setPeaks(json.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const fetchRoute = async (pointsToUse: RoutePoint[]) => {
      try {
        let coordinates = pointsToUse.map((p) => p.coordinates);

        if (routeType === "loop" && pointsToUse.length >= 3) {
          // Dodaj pierwszy punkt na koniec, tworząc pętlę
          coordinates = [...coordinates, coordinates[0]];
        } else if (routeType === "back-and-forth") {
          // Dodaj trasę powrotną (bez duplikatu ostatniego punktu)
          const reverse = [...coordinates].reverse().slice(1);
          coordinates = [...coordinates, ...reverse];
        }

        const response = await fetch("http://localhost:6868/routeTrail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ points: coordinates }),
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
  }, [points, routeType]);

  const addPoint = (newPoint: [number, number]) =>
    setPoints((prev) => [
      ...prev,
      {
        coordinates: newPoint,
        type: "custom",
      },
    ]);
  const removePoint = (indexToRemove: number) =>
    setPoints((prev) => prev.filter((_, i) => i !== indexToRemove));
  const removePointByCoordinates = (lat: number, lng: number) =>
    setPoints((prev) =>
      prev.filter(
        (point) =>
          Math.abs(point.coordinates[0] - lat) > 1e-6 ||
          Math.abs(point.coordinates[1] - lng) > 1e-6,
      ),
    );
  const addPointAtStart = (newPoint: RoutePoint) =>
    setPoints((prev) => [newPoint, ...prev]);
  const addPointM = (newPoint: RoutePoint) =>
    setPoints((prev) => {
      if (prev.length === 0) return [newPoint];
      if (prev.length === 1) return [...prev, newPoint];
      return [...prev.slice(0, -1), newPoint, prev[prev.length - 1]];
    });
  const addPointAtEnd = (newPoint: RoutePoint) =>
    setPoints((prev) => [...prev, newPoint]);

  const handleZoomChange = (zoom: number) => {
    setCurrentZoom(zoom);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <MapContainer
        center={[49.29, 19.95]}
        zoom={12}
        scrollWheelZoom
        className="w-full h-full"
      >
        <ZoomHandler onZoomChange={handleZoomChange} />

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
        {currentZoom >= ZOOM_LEVELS.SHELTERS && (
          <SheltersMap
            shelters={shelters}
            addPointAtStart={addPointAtStart}
            addPointAtEnd={addPointAtEnd}
            addPointM={addPointM}
          />
        )}
        {currentZoom >= ZOOM_LEVELS.PEAKS && (
          <PeaksMap
            peaks={peaks}
            addPointAtStart={addPointAtStart}
            addPointM={addPointM}
            addPointAtEnd={addPointAtEnd}
          />
        )}

        <LocationMarker addPoint={addPoint} />
        <LocationMarkerDelete
          removePointByCoordinates={removePointByCoordinates}
        />

        {points.map((point, idx) => {
          const [lat, lng] = point.coordinates;
          return (
            <Marker
              key={idx}
              position={[lat, lng]}
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
                  {point.name
                    ? `${point.name} (${lat.toFixed(5)}, ${lng.toFixed(5)})`
                    : `Współrzędne: ${lat.toFixed(5)}, ${lng.toFixed(5)}`}
                </Tooltip>
              )}
            </Marker>
          );
        })}

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
          />
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
        onRemovePoint={removePoint}
        onRouteTypeChange={(type) => setRouteType(type)}
      />
    </div>
  );
};

export default MapPlanner;
