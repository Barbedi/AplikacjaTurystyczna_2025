import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import ModalAccept from "@/src/components/ModalAcpet";

const RecordSummaryScreen = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const stats = [
    { icon: "route", label: "Dystans", value: "12.4", unit: "km" },
    { icon: "clock", label: "Czas", value: "2:45", unit: "h" },
    { icon: "mountain", label: "Przewyższenie", value: "450", unit: "m" },
    { icon: "gauge-high", label: "Tempo", value: "4.5", unit: "km/h" },
  ];

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
          <View className="bg-white/10 rounded-2xl p-4 mb-6 backdrop-blur">
            <Text className="text-white text-lg font-semibold mb-3">
              Twoja trasa
            </Text>
            <View className="bg-white/5 rounded-xl h-48 items-center justify-center">
              <FontAwesome6 name="map-location-dot" size={50} color="#60a5fa" />
              <Text className="text-white/50 mt-2">Podgląd mapy</Text>
            </View>
          </View>
          <View className="bg-white/10 rounded-2xl p-5 mb-6 backdrop-blur">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-white/70">Kalorie spalone</Text>
              <Text className="text-white text-lg font-semibold">680 kcal</Text>
            </View>
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-white/70">Maksymalna prędkość</Text>
              <Text className="text-white text-lg font-semibold">8.2 km/h</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-white/70">Data</Text>
              <Text className="text-white text-lg font-semibold">
                19 Lis 2025
              </Text>
            </View>
          </View>
          <View className="gap-3 mb-4">
            <Pressable
              onPress={() => setModalVisible(true)}
              className="bg-purple-600 rounded-2xl p-4 flex-row items-center justify-center active:bg-purple-700"
            >
              <FontAwesome6 name="floppy-disk" size={20} color="#ffffff" />
              <Text className="text-white text-lg font-semibold ml-3">
                Zapisz trasę
              </Text>
            </Pressable>

            <Pressable className="bg-white/10 rounded-2xl p-4 flex-row items-center justify-center active:bg-white/20">
              <FontAwesome6 name="share-nodes" size={20} color="#ffffff" />
              <Text className="text-white text-lg font-semibold ml-3">
                Udostępnij
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
