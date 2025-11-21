import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  MapView,
  Camera,
  RasterSource,
  RasterLayer,
  ShapeSource,
  CircleLayer,
  LineLayer,
} from "@maplibre/maplibre-react-native";
import { TrailPoint, Trails } from "../../types";

const MAPTILER_KEY = "DdJo20VMMy7tFRXLTfO6";
const DEFAULT_CENTER: [number, number] = [19.95, 49.29];

interface MapInfoProps {
  trail?: Trails;
  peakCoordinate?: [number, number];
  trailPoints?: TrailPoint[];
}

const MapsRoute = ({ trail, peakCoordinate, trailPoints }: MapInfoProps) => {
  const [routeGeoJson, setRouteGeoJson] = useState<any>(null);

  useEffect(() => {
    if (trail?.geometry) {
      setRouteGeoJson({
        type: "Feature",
        properties: {},
        geometry: trail.geometry,
      });
    }
  }, [trail]);

  const getMapCenter = (): [number, number] => {
    if (trail?.geometry?.coordinates?.length) {
      const coords = trail.geometry.coordinates;
      const [sumLng, sumLat] = coords.reduce(
        ([accLng, accLat]: number[], [lng, lat]: number[]) => [
          accLng + lng,
          accLat + lat,
        ],
        [0, 0],
      );
      return [sumLng / coords.length, sumLat / coords.length];
    }

    if (peakCoordinate) return peakCoordinate;

    return DEFAULT_CENTER;
  };

  const getZoomLevel = (): number => {
    if (!trail?.geometry?.coordinates?.length) return 12;

    const coords = trail.geometry.coordinates;
    const lngs = coords.map(([lng]: number[]) => lng);
    const lats = coords.map(([, lat]: number[]) => lat);

    const lngSpan = Math.max(...lngs) - Math.min(...lngs);
    const latSpan = Math.max(...lats) - Math.min(...lats);
    const maxSpan = Math.max(lngSpan, latSpan);

   
    const spanWithPadding = maxSpan * 1.3;

    if (spanWithPadding > 1.0) return 8;      
    if (spanWithPadding > 0.5) return 9;      
    if (spanWithPadding > 0.25) return 10;   
    if (spanWithPadding > 0.12) return 11;    
    if (spanWithPadding > 0.06) return 11.5;  
    if (spanWithPadding > 0.03) return 12;    
    if (spanWithPadding > 0.015) return 12.5; 
    if (spanWithPadding > 0.007) return 13;   
    return 13.5; 
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} logoEnabled={false}>
        <Camera
          centerCoordinate={getMapCenter()}
          zoomLevel={getZoomLevel()}
        />

        <RasterSource
          id="base"
          tileSize={512}
          tileUrlTemplates={[
            `https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`,
          ]}
        >
          <RasterLayer id="baseLayer" sourceID="base" />
        </RasterSource>

        {peakCoordinate && (
          <ShapeSource
            id="peak-source"
            shape={{
              type: "Feature",
              properties: {},
              geometry: {
                type: "Point",
                coordinates: peakCoordinate,
              },
            }}
          >
            <CircleLayer
              id="peak-circle"
              style={{
                circleRadius: 8,
                circleColor: "#ef4444",
                circleStrokeWidth: 3,
                circleStrokeColor: "#ffffff",
              }}
            />
          </ShapeSource>
        )}

        {routeGeoJson && (
          <ShapeSource id="route-source" shape={routeGeoJson}>
            <LineLayer
              id="route-line"
              style={{
                lineColor: "#9333ea",
                lineWidth: 4,
              }}
            />
          </ShapeSource>
        )}

        {trailPoints?.map((point, i) => (
          <ShapeSource
            key={`trail-point-${i}`}
            id={`trail-point-source-${i}`}
            shape={{
              type: "Feature",
              properties: {},
              geometry: {
                type: "Point",
                coordinates: [point.lng, point.lat],
              },
            }}
          >
            <CircleLayer
              id={`trail-point-circle-${i}`}
              style={{
                circleRadius: 8,
                circleColor: "#3b82f6",
                circleStrokeWidth: 2,
                circleStrokeColor: "#ffffff",
              }}
            />
          </ShapeSource>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});

export default MapsRoute;
