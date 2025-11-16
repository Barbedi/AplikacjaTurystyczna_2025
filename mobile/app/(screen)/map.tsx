import React from "react";
import { View, StyleSheet } from "react-native";
import {
  Camera,
  MapView,
  RasterSource,
  RasterLayer,
} from "@maplibre/maplibre-react-native";
export default function MapScreen() {
  const MAPTILER_KEY = "DdJo20VMMy7tFRXLTfO6"; // twój klucz

  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
        <Camera
          centerCoordinate={[19.945, 49.299]}
          zoomLevel={12}
          animationDuration={2000}
          animationMode="easeTo"
        />

        <RasterSource
          id="maptiler-outdoor"
          tileSize={512}
          tileUrlTemplates={[
            `https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`,
          ]}
        >
          <RasterLayer
            id="maptiler-outdoor-layer"
            sourceID="maptiler-outdoor"
          />
        </RasterSource>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
