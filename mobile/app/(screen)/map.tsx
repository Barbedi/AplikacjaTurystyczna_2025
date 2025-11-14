import { StyleSheet, View } from 'react-native';

import { MapView, Camera } from "@maplibre/maplibre-react-native";

export default function App() {

  const MAPTILER_API_KEY = "DdJo20VMMy7tFRXLTfO6";

  return (
    <View style={styles.container}>
      <View style={styles.mapcontainer}>
        <MapView 
          style={styles.map} 
          mapStyle={`https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}.png?key=DdJo20VMMy7tFRXLTfO6`}
          logoEnabled={false}
          attributionPosition={{bottom: 8, right: 8}}>
            <Camera
  centerCoordinate={[2, 41.5]}
  zoomLevel={8}
/>
        </MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapcontainer: {
    width: '100%',
    height: '100%',
  },
  map: {
    flex: 1,
  },
});
