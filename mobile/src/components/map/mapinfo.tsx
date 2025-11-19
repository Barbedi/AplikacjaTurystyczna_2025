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

const MapInfo = ({ trail, peakCoordinate, trailPoints }: MapInfoProps) => {
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
    if (peakCoordinate) return peakCoordinate;

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

    return DEFAULT_CENTER;
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} logoEnabled={false}>
        <Camera
          centerCoordinate={getMapCenter()}
          zoomLevel={peakCoordinate ? 13 : 12}
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

export default MapInfo;
