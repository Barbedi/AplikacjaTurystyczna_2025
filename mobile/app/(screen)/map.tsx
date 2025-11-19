import React, { useState, useEffect } from "react";
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
import { Shelters, Peaks } from "../../src/types";

const MapScreen = () => {
  const MAPTILER_KEY = "DdJo20VMMy7tFRXLTfO6";
  const [shelters, setShelters] = useState<Shelters[]>([]);
  const [peaks, setPeaks] = useState<Peaks[]>([]);
  const [routeGeoJson, setRouteGeoJson] = useState<any>(null);
  const [routeType] = useState<"one-way" | "loop" | "back-and-forth">("one-way");
  const [clickedPoints, setClickedPoints] = useState<[number, number][]>([]);

  const handlePress = (e: any) => {
    const { geometry } = e;
    if (geometry?.coordinates) {
      const coord = geometry.coordinates;
      setClickedPoints((prev) => [...prev, coord]);
    }
  };

  useEffect(() => {
    fetch("http://10.0.2.2:6868/shelters")
      .then((res) => res.json())
      .then((json) => setShelters(json.data))
      .catch(console.error);
  }, []);
  useEffect(() => {
    fetch("http://10.0.2.2:6868/peaks")
      .then((res) => res.json())
      .then((json) => setPeaks(json.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (clickedPoints.length < 2) {
      setRouteGeoJson(null);
      return;
    }

    const pointsPayload = clickedPoints.map((coord) => ({
      lat: coord[1],
      lng: coord[0],
    }));

    const fetchLocalRoute = async () => {
      try {
        const res = await fetch("http://10.0.2.2:6868/routing/local", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ points: pointsPayload, routeType }),
        });
        if (!res.ok) {
          console.error("Błąd w odpowiedzi backendu:", res.status);
          setRouteGeoJson(null);
          return;
        }
        const data = await res.json();
        setRouteGeoJson(data);
      } catch (error) {
        console.error("Błąd fetch:", error);
        setRouteGeoJson(null);
      }
    };

    fetchLocalRoute();
  }, [clickedPoints, routeType]);
  
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
       
        {shelters.map((shelter) => (
          <ShapeSource
            key={`shelter-${shelter.id}`}
            id={`shelter-source-${shelter.id}`}
            shape={{
              type: "Feature",
              properties: { name: shelter.name },
              geometry: {
                type: "Point",
                coordinates: [shelter.longitude, shelter.latitude],
              },
            }}
          >
            <CircleLayer
              id={`shelter-circle-${shelter.id}`}
              style={{
                circleRadius: 5,
                circleColor: "#ef4444",
                circleStrokeWidth: 2,
                circleStrokeColor: "#ffffff",
              }}
            />
          </ShapeSource>
        ))}
        {peaks.map((peak) => (
          <ShapeSource
            key={`peak-${peak.id}`}
            id={`peak-source-${peak.id}`}
            shape={{
              type: "Feature",
              properties: { name: peak.name },
              geometry: {
                type: "Point",
                coordinates: [peak.longitude, peak.latitude],
              },
            }}
          >
            <CircleLayer
              id={`peak-circle-${peak.id}`}
              style={{
                circleRadius: 5,
                circleColor: "#2563eb",
                circleStrokeWidth: 2,
                circleStrokeColor: "#ffffff",
              }}
            />
          </ShapeSource>
        ))}

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

        {routeGeoJson && (
          <ShapeSource id="route" shape={routeGeoJson}>
            <LineLayer
              id="route-line"
              style={{
                lineColor: "#9333ea",
                lineWidth: 4,
                lineJoin: "round",
                lineCap: "round",
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