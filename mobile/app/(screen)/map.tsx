import React from "react";
import { View } from "react-native";
import { Camera, MapView } from "@maplibre/maplibre-react-native";

const MAPTILER_KEY = process.env.EXPO_MAPTILER_KEY;
const MAP_STYLE = `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${MAPTILER_KEY}`;

export default function MapScreen() {
  return (
    <View style={{ flex: 1 }}>
      <MapView style={{ flex: 1 }} mapStyle={MAP_STYLE}>
        <Camera zoomLevel={11} centerCoordinate={[19.95, 49.29]} />
      </MapView>
    </View>
  );
}
