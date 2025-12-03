import React, { useEffect } from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import {
  MapView,
  Camera,
  RasterSource,
  RasterLayer,
  ShapeSource,
  LineLayer,
  UserLocation,
} from "@maplibre/maplibre-react-native";
import { useState } from "react";
import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import { useRouteRecorder } from "../../src/hooks/useRouteRecorder";
import { getAuthenticatedUser } from "../../src/config/api";
import { toast } from "../../src/utils/toast";

const RecordScreen = () => {
  const MAPTILER_KEY = "DdJo20VMMy7tFRXLTfO6";
  const { startRecording, stopRecording } = useRouteRecorder();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [duration, setDuration] = useState(0);
  const [coordinates, setCoordinates] = useState<number[][]>([]);
  const [distance, setDistance] = useState(0);
  const router = useRouter();
  let timer: ReturnType<typeof setTimeout>;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getAuthenticatedUser();
        if (data?.user?.id) {
          setUserId(data.user.id);
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        toast.error("Błąd", "Brak uprawnień do lokalizacji");
        return;
      }
    })();
  }, []);

  useEffect(() => {
    if (isPlaying && !isPaused) {
      timer = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timer) {
        clearInterval(timer);
      }
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isPlaying, isPaused]);

  // Live Location Tracking for UI
  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const startWatching = async () => {
      if (isPlaying && !isPaused) {
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Highest,
            distanceInterval: 5, // Update every 5 meters
            timeInterval: 1000,
          },
          (location) => {
            const { latitude, longitude } = location.coords;
            setCoordinates((prev) => {
              const newCoords = [...prev, [longitude, latitude]];

              // Calculate distance added
              if (prev.length > 0) {
                const last = prev[prev.length - 1];
                const dist = calculateDistance(
                  last[1],
                  last[0],
                  latitude,
                  longitude,
                );
                setDistance((d) => d + dist);
              }
              return newCoords;
            });
          },
        );
      } else {
        if (subscription) {
          subscription.remove();
        }
      }
    };

    startWatching();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isPlaying, isPaused]);

  // Haversine formula for distance in km
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? `${hrs}:` : ""}${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = async () => {
    if (!userId) {
      console.error("No user ID available");
      return;
    }

    if (isPaused) {
      setIsPaused(false);
      return;
    }

    try {
      await startRecording(userId, "Trasa " + new Date().toLocaleString());
      setIsPlaying(true);
      setIsPaused(false);
      setDuration(0);
      setCoordinates([]);
      setDistance(0);
    } catch (error) {
      console.error("Failed to start recording:", error);
      toast.error("Błąd", "Nie udało się rozpocząć nagrywania trasy");
    }
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleStop = async () => {
    try {
      const summary = await stopRecording();
      setIsPlaying(false);
      setIsPaused(false);
      if (timer) clearInterval(timer);

      router.push({
        pathname: "/record-summary",
        params: {
          distance: summary.distance,
          elevation_gain: summary.elevation_gain,
          elevation_loss: summary.elevation_loss,
          duration: duration * 1000,
          avg_speed: summary.avg_speed,
          routeId: summary.routeId,
          // We don't pass points here, they are in the file
        },
      });
    } catch (error) {
      console.error("Failed to stop recording:", error);
      toast.error("Błąd", "Nie udało się zatrzymać nagrywania trasy");
    }
  };

  const routeGeoJSON = {
    type: "Feature" as const,
    geometry: {
      type: "LineString" as const,
      coordinates: coordinates,
    },
    properties: {},
  };

  return (
    <View style={styles.container}>

      <MapView style={styles.map} logoEnabled={false}>
        <Camera
          followUserLocation={true}
          zoomLevel={15}
        />
        <UserLocation visible={true} renderMode="native" />

        <RasterSource
          id="base"
          tileSize={512}
          tileUrlTemplates={[
            `https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`,
          ]}
        >
          <RasterLayer id="baseLayer" sourceID="base" />
        </RasterSource>
        {coordinates.length > 1 && (
          <ShapeSource id="routeSource" shape={routeGeoJSON}>
            <LineLayer
              id="routeFill"
              style={{
                lineColor: "#0000FF",
                lineWidth: 5,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
          </ShapeSource>
        )}
      </MapView>
      <View className="absolute top-10 w-full flex-row justify-center">
        <View className="bg-black/40 px-6 py-3 rounded-2xl flex-row gap-10">
          <View className="items-center">
            <Text className="text-white text-xs opacity-70">Czas</Text>
            <Text className="text-white text-xl font-bold">
              {formatTime(duration)}
            </Text>
          </View>

          <View className="items-center">
            <Text className="text-white text-xs opacity-70">Dystans</Text>
            <Text className="text-white text-xl font-bold">
              {distance.toFixed(2)} km
            </Text>
          </View>
        </View>
      </View>

      <View className="absolute bottom-10 w-full flex-row justify-center items-center gap-6">
        {(!isPlaying || isPaused) && (
          <Pressable
            className="bg-black/40 rounded-full h-28 w-28 items-center justify-center"
            onPress={handleStart}
          >
            <FontAwesome6 name="play" size={45} color="#ffffff" />
          </Pressable>
        )}

        {isPlaying && (
          <>
            <Pressable
              className="bg-black/40 rounded-full h-20 w-20 items-center justify-center"
              onPress={handleStop}
            >
              <FontAwesome6 name="stop" size={35} color="#ffffff" />
            </Pressable>

            {!isPaused && (
              <Pressable
                className="bg-black/40 rounded-full h-20 w-20 items-center justify-center"
                onPress={handlePause}
              >
                <FontAwesome6 name="pause" size={35} color="#ffffff" />
              </Pressable>
            )}
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
