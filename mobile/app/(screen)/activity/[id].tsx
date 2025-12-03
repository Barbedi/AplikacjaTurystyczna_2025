import { useLocalSearchParams, useNavigation } from "expo-router";
import { View, Text, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import trackingRecordingService from "@/src/services/trackingRecording.service";
import MapInfo from "@/src/components/map/mapinfo";
import { Trails } from "@/src/types";
import { getRouteTypeLabel } from "@/src/utils/routeTypeLabels";

interface RecordingDetails {
  id: number;
  name: string;
  distance_m: number;
  duration_ms: number;
  elevation_gain: number;
  elevation_loss: number;
  max_speed: number;
  avg_speed: number;
  created_at: string;
  points: {
    lat: number;
    lon: number;
    altitude: number;
    ts: number;
  }[];
}

const ActivityDetails = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const [recording, setRecording] = useState<RecordingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const routeId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id as string);
        if (!routeId) return;

        const res = await trackingRecordingService.getRouteById(routeId);
        // Backend returns { message, data: { ...recording, points: [...] } }
        setRecording(res.data.data);
        
        navigation.setOptions({
          title: res.data.data.name || "Szczegóły aktywności",
        });
      } catch (error) {
        console.error("Błąd pobierania szczegółów:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <LinearGradient colors={["#5996eb", "#050c28"]} className="flex-1 justify-center items-center">
        <Text className="text-white">Ładowanie...</Text>
      </LinearGradient>
    );
  }

  if (!recording) {
    return (
      <LinearGradient colors={["#5996eb", "#050c28"]} className="flex-1 justify-center items-center">
        <Text className="text-white">Nie znaleziono aktywności.</Text>
      </LinearGradient>
    );
  }

  // Prepare data for MapInfo
  // MapInfo expects a 'trail' object with 'geometry'
  const mapTrail: Partial<Trails> = {
    geometry: {
      type: "LineString",
      coordinates: recording.points.map((p) => [p.lon, p.lat]),
    },
  };

  const durationHours = Math.floor(recording.duration_ms / 1000 / 3600);
  const durationMinutes = Math.floor((recording.duration_ms / 1000 % 3600) / 60);
  const durationSeconds = Math.floor((recording.duration_ms / 1000) % 60);

  return (
    <LinearGradient colors={["#5996eb", "#050c28"]} className="flex-1">
      <SafeAreaView edges={["bottom", "left", "right"]} className="flex-1">
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 20,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center ">
            <View className="bg-black/20 w-20 h-20 rounded-full items-center justify-center mb-3">
              <FontAwesome6 name="person-hiking" size={40} color="#000" />
            </View>
            <View className="flex-row bg-black/20 px-2 py-1.5 rounded-2xl items-center justify-center mb-3 gap-2">
            <FontAwesome6 name="calendar" size={16} color="#000" />
            <Text className="text-black font-semibold text-sm mt-1">
              {new Date(recording.created_at).toLocaleString("pl-PL")}
            </Text>
            </View>
          </View>
          <View className=" flex-col gap-4  w-full p-5 rounded-2xl justify-center items-center">
              <View className="flex-row gap-4">
                <View className="bg-white/20 p-5 w-1/2 h-24 rounded-2xl items-center justify-start">
                  <View className="flex-row items-center gap-1">
                    <FontAwesome6 name="route" size={16} color="#60a5fa" />
                    <Text className="text-white text-md ">Dystans</Text>
                  </View>
                  <Text className="text-white text-2xl font-bold">
                    {(recording.distance_m / 1000).toFixed(2)} <Text className="text-sm font-normal">km</Text>
                  </Text>
                </View>
                <View className="bg-white/20 p-5 w-1/2 h-24 rounded-2xl items-center justify-start">
                  <View className="flex-row items-center gap-1">
                    <FontAwesome6 name="clock" size={16} color="#fbbf24" />
                    <Text className="text-white text-md ">Czas</Text>
                  </View>
                  <Text className="text-white text-2xl font-bold">
                {durationHours}:{durationMinutes.toString().padStart(2, '0')}:{durationSeconds.toString().padStart(2, '0')}
              </Text>
                </View>
              </View>
              <View className="flex-row gap-4">
                <View className="bg-white/20 p-5 w-1/2 h-24 rounded-2xl items-center justify-start">
                  <View className="flex-row items-center gap-1">
                    <FontAwesome6 name="arrow-trend-up" size={16} color="#ef4444" />
                    <Text className="text-white text-md ">Przewyższenie</Text>
                  </View>
                  <Text className="text-white text-2xl font-bold">
                {Math.round(recording.elevation_gain)} <Text className="text-sm font-normal">m</Text>
              </Text>
                </View>
                <View className="bg-white/20 p-5 w-1/2 h-24 rounded-2xl items-center justify-start">
                  <View className="flex-row items-center gap-1">
                    <FontAwesome6 name="gauge-high" size={16} color="#a78bfa" />
                    <Text className="text-white text-md ">Śr. prędkość</Text>
                  </View>
                  <Text className="text-white text-2xl font-bold">
                {recording.avg_speed 
                  ? Number(recording.avg_speed).toFixed(1) 
                  : ((recording.distance_m / 1000) / (recording.duration_ms / 1000 / 3600)).toFixed(1)
                } <Text className="text-sm font-normal">km/h</Text>
              </Text>
                </View>
              </View>
            </View>
          <View className="bg-white/10 rounded-2xl p-4 mb-6 backdrop-blur">
            <Text className="text-white text-lg font-semibold mb-3">
              Mapa trasy
            </Text>
            <View className="h-64 rounded-xl overflow-hidden bg-black/20">
              <MapInfo trail={mapTrail as Trails} />
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ActivityDetails;
