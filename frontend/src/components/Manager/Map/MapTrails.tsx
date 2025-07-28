import {
  MapContainer,
  TileLayer,
  Marker,
  LayersControl,
  Tooltip,
  GeoJSON,
} from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { RoutePoint, Trails } from "../../../assets/Data";
import ZoomHandler from "./ZoomHandler";

const { BaseLayer } = LayersControl;

interface MapTrailsProps {
  trail?: Trails;
  hoverPoint?: [number, number] | null;
}

const MapTrails = ({ trail, hoverPoint }: MapTrailsProps) => {
  const [points] = useState<RoutePoint[]>([]);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [routeGeoJson, setRouteGeoJson] = useState<any>(null);
  const [, setCurrentZoom] = useState<number>(12);
  const [mapRef, setMapRef] = useState<L.Map | null>(null);

  useEffect(() => {
    if (trail?.geometry) {
      const geoJson = formatGeometryToGeoJSON(trail.geometry);
      if (geoJson) {
        setRouteGeoJson(geoJson);
      }
    }
  }, [trail]);

  useEffect(() => {
    if (mapRef && routeGeoJson && trail?.geometry?.coordinates && !hoverPoint) {
      const coords = trail.geometry.coordinates;
      if (coords.length > 0) {
        const bounds = L.latLngBounds(
          coords.map((coord: number[]) => [coord[1], coord[0]]),
        );
        mapRef.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [mapRef, routeGeoJson, trail, hoverPoint]);

  const formatGeometryToGeoJSON = (geometry: unknown) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const geom = geometry as any;

      if (geom?.type === "Feature") {
        return geom;
      }

      if (geom?.type && geom?.coordinates) {
        return {
          type: "Feature",
          properties: {},
          geometry: geom,
        };
      }

      return null;
    } catch (error) {
      console.error("Error formatting geometry:", error);
      return null;
    }
  };

  const getMapCenter = (): [number, number] => {
    if (hoverPoint) {
      return hoverPoint;
    }
    if (trail?.geometry?.coordinates && trail.geometry.coordinates.length > 0) {
      const coords = trail.geometry.coordinates;
      let totalLat = 0;
      let totalLng = 0;

      coords.forEach((coord: number[]) => {
        totalLng += coord[0];
        totalLat += coord[1];
      });

      const centerLat = totalLat / coords.length;
      const centerLng = totalLng / coords.length;

      return [centerLat, centerLng];
    }
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
              url="https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}.png?key=rhB0XJ5Y8vgPLieD126O"
              attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a>'
              tileSize={512}
              zoomOffset={-1}
            />
          </BaseLayer>
        </LayersControl>

        {points.map((point, idx) => {
          const [lat, lng] = point.coordinates;
          return (
            <Marker
              key={idx}
              position={[lat, lng]}
              eventHandlers={{
                mouseover: () => setHoveredPoint(idx),
                mouseout: () => setHoveredPoint(null),
              }}
            >
              {hoveredPoint === idx && (
                <Tooltip>
                  <span>{point.name}</span>
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
    </div>
  );
};

export default MapTrails;
