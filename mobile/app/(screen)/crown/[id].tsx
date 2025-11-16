import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { View, Text, Pressable, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import peaksService from "@/src/services/peaks.service";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6";
import { Peaks } from "@/src/types";

const PeakDetails = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [peak, setPeak] = useState<Peaks>();

  useEffect(() => {
    const fetchPeak = async () => {
      try {
        const res = await peaksService.getById(id as string);
        setPeak(res.data.data);
        navigation.setOptions({
          title: res.data.data.name || "Szczyt",
        });
      } catch (error) {
        console.error("Błąd pobierania szczytu:", error);
      }
    };
    if (id) fetchPeak();
  }, [id]);

  if (!peak)
    return <Text className="text-white text-center mt-10">Ładowanie...</Text>;

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
          <View className="flex justify-center items-center">
            <FontAwesome6 name="mountain" size={90} color="#ffffff" />
            <View className="bg-white/10 w-full p-5 rounded-2xl justify-center items-center">
              <Text className="text-lg text-white font-bold">
                Informacje o szczycie:
              </Text>
              <View className="flex-row gap-5">
                <Text className="text-white mt-2 ">
                  Wysokość:
                  <Text className="text-yellow-400 font-semibold ">
                    {peak.elevation} m n.p.m
                  </Text>
                </Text>
                <Text className="text-white mt-2">Region: {peak.region}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default PeakDetails;
