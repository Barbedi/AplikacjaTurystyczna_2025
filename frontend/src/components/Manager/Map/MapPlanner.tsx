import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  LayersControl,
  Tooltip,
  GeoJSON,
} from "react-leaflet";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Shelters, Peaks, RoutePoint, Trails } from "../../../assets/Data";
import SheltersMap from "./PopupShelters";
import PlannerDashboard from "./PlannerDashboard";
import PeaksMap from "./PopupPeaks";
import ZoomHandler from "./ZoomHandler";
import trailsService from "../../../services/trails.service";

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

// Komponent dla hover markera - memoized żeby się nie przeładowywał
const HoverMarker = ({ position }: { position: [number, number] | null }) => {
  // Memoized icon - tworzy się tylko raz
  const hoverIcon = useMemo(
    () =>
      L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
        iconSize: [25, 25],
      }),
    [],
  );

  if (!position) return null;

  return <Marker position={position} icon={hoverIcon} />;
};

const MapPlanner = () => {
  const { id: trailId } = useParams<{ id: string }>();
  const [points, setPoints] = useState<RoutePoint[]>([]);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [routeGeoJson, setRouteGeoJson] = useState<any>(null);
  const [shelters, setShelters] = useState<Shelters[]>([]);
  const [hoverPoint, setHoverPoint] = useState<[number, number] | null>(null);
  const [peaks, setPeaks] = useState<Peaks[]>([]);
  const [currentZoom, setCurrentZoom] = useState<number>(12);
  const navigate = useNavigate();
  const [routeType, setRouteType] = useState<
    "one-way" | "loop" | "back-and-forth"
  >("one-way");
  const [editingTrail, setEditingTrail] = useState<Trails | null>(null);
  const [, setIsLoadingTrail] = useState<boolean>(false);

  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ZOOM_LEVELS = {
    PEAKS: 11,
    SHELTERS: 12,
    DETAILS: 14,
  };

  useEffect(() => {
    if (trailId) {
      setIsLoadingTrail(true);
      trailsService
        .getTrailById(parseInt(trailId))
        .then((response) => {
          const trail = response.data;
          setEditingTrail(trail);
          setRouteType(trail.route_type);

          if (trail.points && trail.points.length > 0) {
            const routePoints: RoutePoint[] = trail.points
              .sort((a, b) => a.point_order - b.point_order)
              .map((point) => ({
                coordinates: [point.lat, point.lng],
                name: point.name || `Punkt ${point.point_order + 1}`,
                type: "custom",
                id: point.id,
              }));
            setPoints(routePoints);
            console.log("Załadowano punkty z bazy:", routePoints);
          } else if (trail.geometry?.coordinates) {
            const routePoints: RoutePoint[] = trail.geometry.coordinates.map(
              (coord: number[], index: number) => ({
                coordinates: [coord[1], coord[0]],
                type: "custom",
                name: `Punkt ${index + 1}`,
              }),
            );
            setPoints(routePoints);
            console.log("Konwertowano geometrię na punkty:", routePoints);
          }
        })
        .catch((error) => {
          console.error("Error loading trail for edit:", error);
        })
        .finally(() => {
          setIsLoadingTrail(false);
        });
    }
  }, [trailId]);

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
          coordinates = [...coordinates, coordinates[0]];
        } else if (routeType === "back-and-forth") {
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

  const addPoint = useCallback(
    (newPoint: [number, number]) =>
      setPoints((prev) => [
        ...prev,
        {
          coordinates: newPoint,
          type: "custom",
        },
      ]),
    [],
  );

  const removePoint = useCallback(
    (indexToRemove: number) =>
      setPoints((prev) => prev.filter((_, i) => i !== indexToRemove)),
    [],
  );

  const removePointByCoordinates = useCallback(
    (lat: number, lng: number) =>
      setPoints((prev) =>
        prev.filter(
          (point) =>
            Math.abs(point.coordinates[0] - lat) > 1e-6 ||
            Math.abs(point.coordinates[1] - lng) > 1e-6,
        ),
      ),
    [],
  );

  const addPointAtStart = useCallback(
    (newPoint: RoutePoint) => setPoints((prev) => [newPoint, ...prev]),
    [],
  );

  const addPointM = useCallback(
    (newPoint: RoutePoint) =>
      setPoints((prev) => {
        if (prev.length === 0) return [newPoint];
        if (prev.length === 1) return [...prev, newPoint];
        return [...prev.slice(0, -1), newPoint, prev[prev.length - 1]];
      }),
    [],
  );

  const addPointAtEnd = useCallback(
    (newPoint: RoutePoint) => setPoints((prev) => [...prev, newPoint]),
    [],
  );
  const handleHoverPoint = useCallback(
    (lat: number | null, lng: number | null) => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      hoverTimeoutRef.current = setTimeout(() => {
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
      }, 16);
    },
    [],
  );

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleTrailUpdated = useCallback((updatedTrail: Trails) => {
    setEditingTrail(updatedTrail);

    if (updatedTrail.points && updatedTrail.points.length > 0) {
      const routePoints: RoutePoint[] = updatedTrail.points
        .sort((a, b) => a.point_order - b.point_order)
        .map((point) => ({
          coordinates: [point.lat, point.lng],
          name: point.name || `Punkt ${point.point_order + 1}`,
          type: "custom",
          id: point.id,
        }));
      setPoints(routePoints);
      console.log("Zaktualizowano punkty po edycji:", routePoints);
    }
  }, []);

  const handleCancelEdit = useCallback(() => {
    if (editingTrail && editingTrail.points && editingTrail.points.length > 0) {
      const originalPoints: RoutePoint[] = editingTrail.points
        .sort((a, b) => a.point_order - b.point_order)
        .map((point) => ({
          coordinates: [point.lat, point.lng],
          name: point.name || `Punkt ${point.point_order + 1}`,
          type: "custom",
          id: point.id,
        }));
      setPoints(originalPoints);
      setRouteType(editingTrail.route_type);
      navigate(`/dashboard/my-routes`);
    }
  }, [editingTrail, navigate]);

  const routeStyle = useMemo(
    () => ({
      color: "red",
      weight: 4,
    }),
    [],
  );

  const pointMarkers = useMemo(
    () =>
      points.map((point, idx) => {
        const [lat, lng] = point.coordinates;
        return (
          <Marker
            key={`${idx}-${lat}-${lng}`}
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
      }),
    [points, hoveredPoint, removePoint],
  );

  return (
    <div className="w-full h-full flex flex-col rounded-lg overflow-hidden border border-white/20 shadow-lg">
      <MapContainer
        center={[49.29, 19.95]}
        zoom={12}
        scrollWheelZoom
        className="w-full h-full"
      >
        <ZoomHandler onZoomChange={setCurrentZoom} />

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
        {pointMarkers}
        {routeGeoJson && (
          <GeoJSON
            key={JSON.stringify(routeGeoJson)}
            data={routeGeoJson}
            style={routeStyle}
          />
        )}
        <HoverMarker position={hoverPoint} />
      </MapContainer>

      <PlannerDashboard
        visible={points.length >= 2}
        points={points}
        route={routeGeoJson}
        editingTrail={editingTrail}
        isEditing={!!trailId}
        onHoverPoint={handleHoverPoint}
        onRemovePoint={removePoint}
        onRouteTypeChange={(type) => setRouteType(type)}
        onTrailUpdated={handleTrailUpdated}
        onCancelEdit={handleCancelEdit}
      />
    </div>
  );
};

export default MapPlanner;
