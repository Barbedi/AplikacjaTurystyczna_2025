import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  MapView,
  Camera,
  RasterSource,
  RasterLayer,
  ShapeSource,
  LineLayer,
  CircleLayer,
} from "@maplibre/maplibre-react-native";
import { Shelters } from "../../src/types";
import { useEffect } from "react";

const MapScreen = () => {
  const MAPTILER_KEY = "DdJo20VMMy7tFRXLTfO6";
   const [shelters, setShelters] = useState<Shelters[]>([]);

  const [clickedPoints, setClickedPoints] = useState<
    [number, number][]
  >([]);

  const handlePress = (e: any) => {
    const { geometry } = e;
    if (geometry?.coordinates) {
      const coord = geometry.coordinates;
      setClickedPoints((prev) => [...prev, coord]);
    }
  };
  useEffect(() => {
  fetch("http://localhost:6868/shelters")
    .then(res => res.json())
    .then(json => setShelters(json.data))
    .catch(console.error);
}, []);

  const lineGeoJSON = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: clickedPoints,
    },
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        logoEnabled={false}
        onPress={handlePress}
      >
        <Camera
          centerCoordinate={[19.945, 49.299]}
          zoomLevel={12}
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

        {clickedPoints.map((p, i) => (
          <ShapeSource
            key={`point-${i}`}
            id={`point-source-${i}`}
            shape={{
              type: "Feature",
              properties: {},
              geometry: {
                type: "Point",
                coordinates: p,
              },
            }}
          >
            <CircleLayer
              id={`point-circle-${i}`}
              style={{
                circleRadius: 7,
                circleColor: "#9333ea",
                circleStrokeWidth: 3,
                circleStrokeColor: "#ffffff",
              }}
            />
          </ShapeSource>
        ))}

{clickedPoints.length >= 2 && (
  <ShapeSource
    id="line"
    shape={{
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: clickedPoints,
      },
    }}
  >
    <LineLayer
      id="linelayer"
      style={{
        lineColor: "#9333ea",
        lineWidth: 3,
      }}
    />
  </ShapeSource>
)}

      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});


export default MapScreen;