import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { View, Text, Pressable, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import peaksService from "@/src/services/peaks.service";
import { SafeAreaView } from "react-native-safe-area-context";

const PeakDetails = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [peak, setPeak] = useState<any>(null);

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
          <Text className="text-3xl font-bold text-white mb-2">
            {peak.name}
          </Text>
          <Text className="text-white/80 mb-4">{peak.elevation} m n.p.m.</Text>
          <Text className="text-white/70">{peak.region}</Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default PeakDetails;
