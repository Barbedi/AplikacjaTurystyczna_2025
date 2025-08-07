import {
  MapContainer,
  TileLayer,
  Marker,
  LayersControl,
  Tooltip,
  GeoJSON,
} from "react-leaflet";
import { useState, useEffect, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TrailPoint, Trails } from "../../../assets/Data";
import ZoomHandler from "./ZoomHandler";

const { BaseLayer } = LayersControl;

interface MapTrailsProps {
  trail?: Trails;
  hoverPoint?: [number, number] | null;
  trailPoints?: TrailPoint[];
}

const MapTrails = ({ trail, hoverPoint, trailPoints }: MapTrailsProps) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [routeGeoJson, setRouteGeoJson] = useState<any>(null);
  const [, setCurrentZoom] = useState<number>(12);
  const [mapRef, setMapRef] = useState<L.Map | null>(null);

  // Ikony jak w MapPlanner
  const startFlagIcon = useMemo(
    () =>
      L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/2107/2107961.png",
        iconSize: [30, 30],
        iconAnchor: [2.5, 30],
      }),
    [],
  );

  const endFlagIcon = useMemo(
    () =>
      L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/16982/16982672.png",
        iconSize: [30, 30],
        iconAnchor: [2.5, 30],
      }),
    [],
  );

  const midPointIcon = useMemo(
    () =>
      L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/17116/17116302.png",
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      }),
    [],
  );

  useEffect(() => {
    if (trail?.geometry) {
      const geoJson = formatGeometryToGeoJSON(trail.geometry);
      if (geoJson) setRouteGeoJson(geoJson);
    }
  }, [trail]);

  useEffect(() => {
    if (mapRef && routeGeoJson && trail?.geometry?.coordinates && !hoverPoint) {
      try {
        // Sprawdź czy coordinates to prawidłowa tablica
        const coords = trail.geometry.coordinates;
        if (!Array.isArray(coords) || coords.length === 0) {
          console.warn("Nieprawidłowe współrzędne trasy:", coords);
          return;
        }

        // Sprawdź czy każdy punkt ma prawidłową strukturę [lng, lat]
        const validCoords = coords.filter(
          (coord) =>
            Array.isArray(coord) &&
            coord.length >= 2 &&
            typeof coord[0] === "number" &&
            typeof coord[1] === "number" &&
            !isNaN(coord[0]) &&
            !isNaN(coord[1]),
        );

        if (validCoords.length === 0) {
          console.warn("Brak prawidłowych współrzędnych w trasie");
          return;
        }

        // Konwertuj [lng, lat] na [lat, lng] dla Leaflet
        const latLngCoords = validCoords.map(
          ([lng, lat]) => [lat, lng] as [number, number],
        );
        const bounds = L.latLngBounds(latLngCoords);

        // Sprawdź czy bounds są prawidłowe
        if (bounds.isValid()) {
          mapRef.fitBounds(bounds, { padding: [20, 20] });
        } else {
          console.warn("Nieprawidłowe bounds dla trasy");
        }
      } catch (error) {
        console.error("Błąd podczas ustawiania bounds:", error);
      }
    }
  }, [mapRef, routeGeoJson, trail, hoverPoint]);

  const formatGeometryToGeoJSON = (geometry: unknown) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const geom = geometry as any;

      if (!geom) {
        console.warn("Geometry is null or undefined");
        return null;
      }

      if (geom?.type === "Feature") return geom;

      if (geom?.type && geom?.coordinates) {
        // Sprawdź czy coordinates to prawidłowa tablica
        if (!Array.isArray(geom.coordinates) || geom.coordinates.length === 0) {
          console.warn(
            "Nieprawidłowe coordinates w geometry:",
            geom.coordinates,
          );
          return null;
        }

        return {
          type: "Feature",
          properties: {},
          geometry: geom,
        };
      }

      console.warn("Nierozpoznana struktura geometry:", geom);
      return null;
    } catch (error) {
      console.error("Error formatting geometry:", error);
      return null;
    }
  };

  const getMapCenter = (): [number, number] => {
    if (hoverPoint) return hoverPoint;

    if (trail?.geometry?.coordinates?.length) {
      try {
        const coords = trail.geometry.coordinates;

        // Sprawdź czy coords to prawidłowa tablica punktów
        const validCoords = coords.filter(
          (coord) =>
            Array.isArray(coord) &&
            coord.length >= 2 &&
            typeof coord[0] === "number" &&
            typeof coord[1] === "number" &&
            !isNaN(coord[0]) &&
            !isNaN(coord[1]),
        );

        if (validCoords.length > 0) {
          const [sumLat, sumLng] = validCoords.reduce(
            ([accLat, accLng], [lng, lat]) => [accLat + lat, accLng + lng],
            [0, 0],
          );
          return [sumLat / validCoords.length, sumLng / validCoords.length];
        }
      } catch (error) {
        console.error("Błąd podczas obliczania centrum mapy:", error);
      }
    }

    // Domyślne centrum (Tatry)
    return [49.29, 19.95];
  };

  return (
    <div className="w-full h-full flex flex-col rounded-lg overflow-hidden border border-white/20 shadow-lg">
      <MapContainer
        key={hoverPoint ? `${hoverPoint[0]}-${hoverPoint[1]}` : "default"}
        center={getMapCenter()}
        zoom={hoverPoint ? 14 : 12}
        scrollWheelZoom
        className="w-full h-full"
        ref={setMapRef}
      >
        <ZoomHandler onZoomChange={setCurrentZoom} />

        <LayersControl position="topright">
          <BaseLayer checked name="MapTiler Outdoor">
            <TileLayer
              url="https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}.png?key=LXZqP992yx8E1L0p04Uy"
              attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a>'
              tileSize={512}
              zoomOffset={-1}
            />
          </BaseLayer>
        </LayersControl>

        {trailPoints &&
          trailPoints.length > 0 &&
          trailPoints.map((point, idx) => {
            // Dodaj zabezpieczenia dla struktury punktów
            if (
              !point ||
              typeof point.lat !== "number" ||
              typeof point.lng !== "number"
            ) {
              console.warn("Nieprawidłowa struktura punktu:", point);
              return null;
            }

            const isFirst = idx === 0;
            const isLast = idx === trailPoints.length - 1;

            // Użyj ikon jak w MapPlanner
            let icon;
            if (isFirst) icon = startFlagIcon;
            else if (isLast) icon = endFlagIcon;
            else icon = midPointIcon;

            return (
              <Marker
                key={point.id || idx}
                position={[point.lat, point.lng]}
                icon={icon}
                eventHandlers={{
                  mouseover: () => setHoveredPoint(point.point_order ?? idx),
                  mouseout: () => setHoveredPoint(null),
                }}
              >
                {hoveredPoint === (point.point_order ?? idx) && (
                  <Tooltip direction="top" offset={[0, -15]}>
                    <span>{point.name || `Punkt ${idx + 1}`}</span>
                  </Tooltip>
                )}
              </Marker>
            );
          })}

        {routeGeoJson && (
          <GeoJSON
            key={JSON.stringify(routeGeoJson)}
            data={routeGeoJson}
            style={{ color: "#9333ea", weight: 4, dashArray: "5, 5" }}
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
    </div>
  );
};

export default MapTrails;
