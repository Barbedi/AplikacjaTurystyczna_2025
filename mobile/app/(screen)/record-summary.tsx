import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useLocalSearchParams, useRouter } from "expo-router";
import ModalAccept from "@/src/components/ModalAcpet";
import MapInfo from "@/src/components/map/mapinfo";
import * as FileSystem from "expo-file-system/legacy";

const RecordSummaryScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [modalVisible, setModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ------- PARSOWANIE PARAMETRÓW PRZESŁANYCH Z stopRecording() -------
  const distanceKm = params.distance ? (Number(params.distance) / 1000).toFixed(2) : "0.00";
  const elevationGain = params.elevation_gain ? Math.round(Number(params.elevation_gain)) : "0";
  const calories = params.calories ? Math.round(Number(params.calories)) : 0;
  const maxSpeed = params.max_speed ? Number(params.max_speed).toFixed(1) : "0.0";

  // Czas trwania
  const durationMs = params.duration ? Number(params.duration) : 0;
  const hours = Math.floor(durationMs / 1000 / 3600);
  const minutes = Math.floor((durationMs / 1000 % 3600) / 60);
  const seconds = Math.floor((durationMs / 1000) % 60);
  const timeString = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const avgSpeed = params.avg_speed ? Number(params.avg_speed).toFixed(1) : "0.0";

  // -------- STATYSTYKI DO WYŚWIETLENIA --------
  const stats = [
    { icon: "route", label: "Dystans", value: distanceKm, unit: "km" },
    { icon: "clock", label: "Czas", value: timeString, unit: "" },
    { icon: "mountain", label: "Przewyższenie", value: elevationGain, unit: "m" },
    { icon: "gauge-high", label: "Tempo", value: avgSpeed, unit: "km/h" },
  ];

  // ------- ZAPIS TRASY -------
  const handleSave = async () => {
    setIsSaving(true);

    // Czyścimy pliki lokalne
    await FileSystem.deleteAsync(FileSystem.documentDirectory + "current_route.json", { idempotent: true });
    await FileSystem.deleteAsync(FileSystem.documentDirectory + "upload_buffer.json", { idempotent: true });

    setIsSaving(false);
    setModalVisible(true);
  };

  return (
    <LinearGradient colors={["#5996eb", "#050c28"]} className="flex-1">
      <SafeAreaView edges={["bottom", "left", "right"]} className="flex-1">
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <View className="items-center mb-6">
            <View className="bg-green-500 rounded-full p-4 h-20 w-20 items-center justify-center mb-4">
              <FontAwesome6 name="check" size={40} color="#ffffff" />
            </View>
            <Text className="text-white text-3xl font-bold mb-2">
              Świetna robota!
            </Text>
            <Text className="text-white/70 text-center">
              Właśnie ukończyłeś swoją trasę
            </Text>
          </View>

          {/* STATYSTYKI */}
          <View className="flex-row flex-wrap justify-between mb-6">
            {stats.map((stat, index) => (
              <View
                key={index}
                className="bg-white/10 rounded-2xl p-5 mb-4 w-[48%] backdrop-blur"
              >
                <View className="flex-row items-center mb-3">
                  <FontAwesome6 name={stat.icon} size={20} color="#60a5fa" />
                  <Text className="text-white/70 ml-2 text-sm">
                    {stat.label}
                  </Text>
                </View>
                <View className="flex-row items-baseline">
                  <Text className="text-white text-3xl font-bold">
                    {stat.value}
                  </Text>
                  <Text className="text-white/70 ml-1 text-lg">
                    {stat.unit}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* MAPA */}
          <View className="bg-white/10 rounded-2xl p-4 mb-6 backdrop-blur">
            <Text className="text-white text-lg font-semibold mb-3">
              Twoja trasa
            </Text>
            <View className="h-48 flex-1 rounded-2xl overflow-hidden">
              <MapInfo />
            </View>
          </View>

          {/* DODATKOWE METRYKI */}
          <View className="bg-white/10 rounded-2xl p-5 mb-6 backdrop-blur">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-white/70">Kalorie spalone</Text>
              <Text className="text-white text-lg font-semibold">{calories} kcal</Text>
            </View>

            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-white/70">Maksymalna prędkość</Text>
              <Text className="text-white text-lg font-semibold">{maxSpeed} km/h</Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-white/70">Data</Text>
              <Text className="text-white text-lg font-semibold">
                {new Date().toLocaleDateString("pl-PL")}
              </Text>
            </View>
          </View>
          <View className="gap-3 mb-4">
            <Pressable
              onPress={handleSave}
              disabled={isSaving}
              className={`bg-purple-600 rounded-2xl p-4 flex-row items-center justify-center active:bg-purple-700 ${isSaving ? "opacity-50" : ""}`}
            >
              <FontAwesome6 name="floppy-disk" size={20} color="#ffffff" />
              <Text className="text-white text-lg font-semibold ml-3">
                {isSaving ? "Zapisywanie..." : "Zapisz trasę"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.back()}
              className="bg-white/5 rounded-2xl p-4 items-center active:bg-white/10"
            >
              <Text className="text-white/70 text-base">Odrzuć trasę</Text>
            </Pressable>
          </View>
          <ModalAccept
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            onConfirm={() => {
              setModalVisible(false);
              router.push("/myRoutes");
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default RecordSummaryScreen;
