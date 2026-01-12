import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import trailService from "../../src/services/trails.service";
import React, { useState, useEffect } from "react";
import { Trails } from "../../src/types";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const RegionTrails = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { name } = useLocalSearchParams();
  const [trails, setTrails] = useState<Trails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: name || "Trasy",
    });
  }, [navigation, name]);

  useEffect(() => {
    if (!name) return;

    trailService
      .gettrailByRegionAll(name as string)
      .then((res) => {
        setTrails(res.data.data);
      })
      .catch(() => {
        setError("Nie udało się załadować szlaków. Spróbuj ponownie później.");
      })
      .finally(() => setLoading(false));
  }, [name]);

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
          <View className="flex-col gap-4">
            {loading && (
              <View className="flex-1 justify-center items-center py-20">
                <ActivityIndicator size="large" color="#ffffff" />
                <Text className="text-white text-center mt-4">
                  Ładowanie szlaków...
                </Text>
              </View>
            )}

            {error && (
              <View className="bg-red-500/20 p-4 rounded-xl border border-red-500/50">
                <View className="flex-row items-center justify-center mb-2">
                  <FontAwesome6
                    name="circle-exclamation"
                    size={24}
                    color="#f87171"
                  />
                </View>
                <Text className="text-red-200 text-center">{error}</Text>
              </View>
            )}

            {!loading && !error && trails && trails.length > 0 ? (
              trails.map((trail) => (
                <Pressable
                  key={trail.id}
                  onPress={() => router.push(`/region/trail/${trail.id}`)}
                  className="w-full bg-white/10 rounded-2xl p-4 border border-white/10 active:bg-white/20"
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <Text
                      className="text-xl font-bold text-white flex-1 mr-2"
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {trail.name || "Nieznany szlak"}
                    </Text>
                    {trail.difficulty && (
                      <View
                        className={`px-2 py-1 rounded-full ${
                          trail.difficulty === "Trudny"
                            ? "bg-red-500/30"
                            : trail.difficulty === "Średni"
                              ? "bg-yellow-500/30"
                              : "bg-green-500/30"
                        }`}
                      >
                        <Text className="text-white text-xs font-bold">
                          {trail.difficulty}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View className="flex-row items-center gap-4 mt-2">
                    <View className="flex-row items-center gap-1.5">
                      <FontAwesome6
                        name="person-hiking"
                        size={14}
                        color="#cbd5e1"
                      />
                      <Text className="text-gray-300 text-sm">
                        {trail.length_km || "?"} km
                      </Text>
                    </View>

                    <View className="flex-row items-center gap-1.5">
                      <FontAwesome6 name="clock" size={14} color="#cbd5e1" />
                      <Text className="text-gray-300 text-sm">
                        {Math.floor(trail.duration_minutes / 60)}h{" "}
                        {trail.duration_minutes % 60}min
                      </Text>
                    </View>

                    <View className="flex-row items-center gap-1.5">
                      <FontAwesome6
                        name="arrow-trend-up"
                        size={14}
                        color="#cbd5e1"
                      />
                      <Text className="text-gray-300 text-sm">
                        {trail.elevation_gain || "?"} m
                      </Text>
                    </View>
                  </View>
                  <View className="mt-2">
                    <Text
                      className="text-gray-300 text-sm"
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {trail.description}
                    </Text>
                  </View>
                  <View className="mt-2 items-center">
                    <Text className="text-white text-sm font-bold">
                      Naciskaj aby zobaczyć szczegóły
                    </Text>
                  </View>
                </Pressable>
              ))
            ) : !loading && !error ? (
              <View className="flex-1 items-center justify-center py-20">
                <View className="bg-white/10 p-6 rounded-full mb-4">
                  <FontAwesome6
                    name="mountain-sun"
                    size={40}
                    color="#ffffff80"
                  />
                </View>
                <Text className="text-white/80 text-center font-bold text-xl">
                  Brak tras
                </Text>
                <Text className="text-white/60 text-center mt-2 px-10">
                  Nie znaleziono żadnych szlaków w regionie {name}.
                </Text>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default RegionTrails;
