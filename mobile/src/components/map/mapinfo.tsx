import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import {
  MapView,
  Camera,
  RasterSource,
    RasterLayer,
} from "@maplibre/maplibre-react-native";

const MapScreen = () => {
  const MAPTILER_KEY = "DdJo20VMMy7tFRXLTfO6";
  

  

  
  
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        logoEnabled={false}
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
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});


export default MapScreen;