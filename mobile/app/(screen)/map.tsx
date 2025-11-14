import { View, StyleSheet } from "react-native";
import { MapView, Camera } from "@maplibre/maplibre-react-native";

export default function MapScreen() {
  const MAPTILER_KEY = "TWÓJ_KEY";

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        mapStyle={`https://api.maptiler.com/maps/outdoor-v2/style.json?key=${MAPTILER_KEY}`}
      >
        <Camera
          zoomLevel={10}
          centerCoordinate={[19.94, 50.06]}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
