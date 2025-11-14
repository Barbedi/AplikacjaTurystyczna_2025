import React from "react";
import { View, StyleSheet } from "react-native";
import  MapLibreGL from "@maplibre/maplibre-react-native";

export default function MapScreen() {
  const MAPTILER_KEY = "DdJo20VMMy7tFRXLTfO6"; // twój klucz

  return (
    <View style={styles.container}>
      <MapLibreGL.MapView style={styles.map}>
        <MapLibreGL.Camera
          zoomLevel={10}
          centerCoordinate={[19.94, 50.06]} // Kraków
        />

        <MapLibreGL.RasterSource
          id="maptiler-outdoor"
          tileSize={256}
          tileUrlTemplates={[
            `https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`,
          ]}
        >
          <MapLibreGL.RasterLayer
            id="maptiler-outdoor-layer"
            sourceID="maptiler-outdoor"
          />
        </MapLibreGL.RasterSource>
      </MapLibreGL.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
