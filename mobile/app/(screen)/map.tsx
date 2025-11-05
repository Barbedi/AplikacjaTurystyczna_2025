import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import MapLibreGL from "react-native-maplibre-gl";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

// 🔑 Klucze i adres backendu z .env
const MAPTILER_KEY = process.env.EXPO_MAPTILER_KEY;
const API_URL = process.env.EXPO_API_URL;

// ✅ Prawidłowy URL stylu MapTiler Outdoor
const MAP_STYLE = `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${MAPTILER_KEY}`;

export default function MapScreen() {
  const [peaks, setPeaks] = useState<any[]>([]);
  const [shelters, setShelters] = useState<any[]>([]);
  const [route, setRoute] = useState<any>(null);
  const [points, setPoints] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(true);

  // 🗻 Pobieranie szczytów i schronisk
  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/peaks`).then((r) => r.json()),
      fetch(`${API_URL}/shelters`).then((r) => r.json()),
    ])
      .then(([peaksData, sheltersData]) => {
        setPeaks(peaksData.data || []);
        setShelters(sheltersData.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // 🟢 Dodanie punktu po tapnięciu
  const handlePress = (e: any) => {
    const [lng, lat] = e.geometry.coordinates;
    setPoints((prev) => [...prev, [lng, lat]]);
  };

  // 🔴 Usunięcie punktu po długim przytrzymaniu
  const handleLongPress = (e: any) => {
    const [lng, lat] = e.geometry.coordinates;
    setPoints((prev) =>
      prev.filter(
        (p) =>
          Math.abs(p[0] - lng) > 0.0001 || Math.abs(p[1] - lat) > 0.0001
      )
    );
  };

  // 🚦 Po dodaniu ≥2 punktów pobierz trasę z backendu
  useEffect(() => {
    if (points.length < 2) return;
    fetch(`${API_URL}/routing/local`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        points: points.map(([lng, lat]) => ({ lat, lng })),
      }),
    })
      .then((res) => res.json())
      .then(setRoute)
      .catch(console.error);
  }, [points]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  return (
    <LinearGradient colors={["#5996eb", "#050c28"]} className="flex-1">
      <SafeAreaView style={{ flex: 1 }}>
        <MapLibreGL.MapView
          style={{ flex: 1 }}
          styleURL={MAP_STYLE}
          onPress={handlePress}
          onLongPress={handleLongPress}
        >
          <MapLibreGL.Camera
            zoomLevel={11}
            centerCoordinate={[19.95, 49.29]} // Zakopane
          />

          {/* 🟣 Szczyty */}
          <MapLibreGL.ShapeSource
            id="peaks"
            shape={{
              type: "FeatureCollection",
              features: peaks.map((p) => ({
                type: "Feature",
                geometry: { type: "Point", coordinates: [p.lng, p.lat] },
                properties: { name: p.name },
              })),
            }}
          >
            <MapLibreGL.SymbolLayer
              id="peaksLayer"
              style={{
                iconImage: require("@/assets/icons/peak.png"),
                iconSize: 0.25,
                textField: ["get", "name"],
                textSize: 10,
                textOffset: [0, 1],
                textColor: "#ffffff",
                textHaloColor: "#000000",
                textHaloWidth: 1,
              }}
            />
          </MapLibreGL.ShapeSource>

          {/* 🏠 Schroniska */}
          <MapLibreGL.ShapeSource
            id="shelters"
            shape={{
              type: "FeatureCollection",
              features: shelters.map((s) => ({
                type: "Feature",
                geometry: { type: "Point", coordinates: [s.lng, s.lat] },
                properties: { name: s.name },
              })),
            }}
          >
            <MapLibreGL.SymbolLayer
              id="sheltersLayer"
              style={{
                iconImage: require("@/assets/icons/shelter.png"),
                iconSize: 0.3,
                textField: ["get", "name"],
                textSize: 10,
                textOffset: [0, 1],
                textColor: "#e5e5e5",
              }}
            />
          </MapLibreGL.ShapeSource>

          {/* 🚩 Punkty użytkownika */}
          {points.map(([lng, lat], i) => (
            <MapLibreGL.PointAnnotation
              key={i}
              id={`p-${i}`}
              coordinate={[lng, lat]}
            >
              <View
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: i === 0 ? "#22c55e" : "#9333ea",
                  borderWidth: 2,
                  borderColor: "#fff",
                }}
              />
            </MapLibreGL.PointAnnotation>
          ))}

          {/* 🟣 Trasa z backendu */}
          {route && (
            <MapLibreGL.ShapeSource id="route" shape={route}>
              <MapLibreGL.LineLayer
                id="routeLine"
                style={{
                  lineColor: "#9333ea",
                  lineWidth: 4,
                  lineDasharray: [2, 2],
                }}
              />
            </MapLibreGL.ShapeSource>
          )}
        </MapLibreGL.MapView>

        <View className="absolute bottom-5 w-full items-center">
          <Text className="text-white/70 text-sm">
            Tapnij, aby dodać punkt. Przytrzymaj, aby usunąć.
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
