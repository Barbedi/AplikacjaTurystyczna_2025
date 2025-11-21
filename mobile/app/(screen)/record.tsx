import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import {
  MapView,
  Camera,
  RasterSource,
  RasterLayer,
} from "@maplibre/maplibre-react-native";
import { useState } from "react";
import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6";
import { useRouter } from "expo-router";

const RecordScreen = () => {
  const MAPTILER_KEY = "DdJo20VMMy7tFRXLTfO6";
  const [isPlaying, setIsPlaying] = useState(false);
  const router = useRouter();
  const stopRecording = () => {
    console.log("stop recording");
    setIsPlaying(false);
    router.push("/record-summary");
  };

  return (
    <View style={styles.container}>
      {/* MAPA */}
      <MapView style={styles.map} logoEnabled={false}>
        <Camera centerCoordinate={[19.945, 49.299]} zoomLevel={12} />

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
      <View className="absolute top-10 w-full flex-row justify-center">
        <View className="bg-black/40 px-6 py-3 rounded-2xl flex-row gap-10">
          <View className="items-center">
            <Text className="text-white text-xs opacity-70">Czas</Text>
            <Text className="text-white text-xl font-bold">00:12:45</Text>
          </View>

          <View className="items-center">
            <Text className="text-white text-xs opacity-70">Dystans</Text>
            <Text className="text-white text-xl font-bold">3.42 km</Text>
          </View>
        </View>
      </View>

      <View className="absolute bottom-10 w-full flex-row justify-center items-center gap-6">
        {/* Gdy NIE nagrywa → tylko PLAY */}
        {!isPlaying && (
          <Pressable
            className="bg-black/40 rounded-full h-28 w-28 items-center justify-center"
            onPress={() => setIsPlaying(true)}
          >
            <FontAwesome6 name="play" size={45} color="#ffffff" />
          </Pressable>
        )}
        {isPlaying && (
          <>
            <Pressable
              className="bg-black/40 rounded-full h-20 w-20 items-center justify-center"
              onPress={stopRecording}
            >
              <FontAwesome6 name="stop" size={35} color="#ffffff" />
            </Pressable>

            <Pressable
              className="bg-black/40 rounded-full h-20 w-20 items-center justify-center"
              onPress={() => console.log("pause")}
            >
              <FontAwesome6 name="pause" size={35} color="#ffffff" />
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});

export default RecordScreen;
