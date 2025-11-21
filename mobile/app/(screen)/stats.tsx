import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";
import useGetUsers from "@/src/hooks/useGetUser";
import statisticsService from "@/src/services/statictic.service";
import { getAuthenticatedUser } from "@/src/config/api";

const StatsScreen = () => {
  const { getUserByEmail, usersData, loading: userLoading } = useGetUsers();
  const [statistics, setStatistics] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const authData = await getAuthenticatedUser();
        if (authData?.user?.email) {
          await getUserByEmail(authData.user.email);
        }
      } catch (error) {
        console.error("Błąd ładowania użytkownika:", error);
        setError("Nie udało się załadować danych użytkownika.");
      }
    };

    loadUser();
  }, [getUserByEmail]);

  const currentUser = usersData?.[0]?.[0];

  useEffect(() => {
    const loadStats = async () => {
      if (!currentUser?.id) return;
      setLoading(true);
      try {
        const data = await statisticsService.getStatisticsForUser(
          currentUser.id,
        );
        setStatistics(data);
      } catch (err) {
        console.error(err);
        setError("Nie udało się załadować statystyk.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.id) loadStats();
  }, [currentUser?.id]);

  if (loading || userLoading) {
    return (
      <LinearGradient
        colors={["#5996eb", "#050c28"]}
        className="flex-1 items-center justify-center"
      >
        <ActivityIndicator color="#fff" size="large" />
      </LinearGradient>
    );
  }

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
          {error && (
            <View className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
              <Text className="text-red-200 text-center">{error}</Text>
            </View>
          )}
          <View className="bg-white/10 rounded-2xl p-5 mb-4 border-l-4 border-blue-500">
            <View className="flex-row items-center gap-3 mb-4">
              <Text className="text-2xl font-bold text-white flex-1">
                Korona Gór Polski
              </Text>
            </View>

            <View className="flex-row justify-between gap-3">
              <View className="flex-1 bg-white/10 rounded-xl p-3 items-center">
                <Text className="text-3xl font-bold text-white">
                  {statistics?.crowns.kgp.visited || 0}
                </Text>
                <Text className="text-white/70 text-xs mt-1">Zdobyte</Text>
              </View>
              <View className="flex-1 bg-white/10 rounded-xl p-3 items-center">
                <Text className="text-3xl font-bold text-white">
                  {statistics?.crowns.kgp.all || 0}
                </Text>
                <Text className="text-white/70 text-xs mt-1">Wszystkie</Text>
              </View>
              <View className="flex-1 bg-white/10 rounded-xl p-3 items-center">
                <Text className="text-3xl font-bold text-green-400">
                  {(statistics?.crowns.kgp.percent ?? 0).toFixed(0)}%
                </Text>
                <Text className="text-white/70 text-xs mt-1">Ukończono</Text>
              </View>
            </View>
          </View>

          <View className="bg-white/10 rounded-2xl p-5 mb-4 border-l-4 border-blue-500">
            <View className="flex-row items-center gap-3 mb-4">
              <Text className="text-2xl font-bold text-white flex-1">
                Korona Beskidu Sądeckiego
              </Text>
            </View>

            <View className="flex-row justify-between gap-3">
              <View className="flex-1 bg-white/10 rounded-xl p-3 items-center">
                <Text className="text-3xl font-bold text-white">
                  {statistics?.crowns.kbs.visited || 0}
                </Text>
                <Text className="text-white/70 text-xs mt-1">Zdobyte</Text>
              </View>
              <View className="flex-1 bg-white/10 rounded-xl p-3 items-center">
                <Text className="text-3xl font-bold text-white">
                  {statistics?.crowns.kbs.all || 0}
                </Text>
                <Text className="text-white/70 text-xs mt-1">Wszystkie</Text>
              </View>
              <View className="flex-1 bg-white/10 rounded-xl p-3 items-center">
                <Text className="text-3xl font-bold text-green-400">
                  {(statistics?.crowns.kbs.percent ?? 0).toFixed(0)}%
                </Text>
                <Text className="text-white/70 text-xs mt-1">Ukończono</Text>
              </View>
            </View>
          </View>
          <View className="flex-col gap-3">
            <View className="bg-white/10 rounded-xl p-4 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="bg-yellow-500/20 w-10 h-10 rounded-full items-center justify-center">
                  <FontAwesome6 name="crown" size={18} color="#eab308" />
                </View>
                <Text className="text-white font-semibold">
                  Zdobyte szczyty
                </Text>
              </View>
              <Text className="text-2xl font-bold text-white">
                {statistics?.allUserPeaks || 0}
              </Text>
            </View>

            <View className="bg-white/10 rounded-xl p-4 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="bg-blue-500/20 w-10 h-10 rounded-full items-center justify-center">
                  <FontAwesome6 name="route" size={18} color="#3b82f6" />
                </View>
                <Text className="text-white font-semibold">Trasy</Text>
              </View>
              <Text className="text-2xl font-bold text-white">
                {statistics?.allUserTrails || 0}
              </Text>
            </View>

            <View className="bg-white/10 rounded-xl p-4 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="bg-green-500/20 w-10 h-10 rounded-full items-center justify-center">
                  <FontAwesome6 name="share" size={18} color="#22c55e" />
                </View>
                <Text className="text-white font-semibold">Udostępnione</Text>
              </View>
              <Text className="text-2xl font-bold text-white">
                {statistics?.allUserTrailsShared || 0}
              </Text>
            </View>

            <View className="bg-white/10 rounded-xl p-4 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="bg-orange-500/20 w-10 h-10 rounded-full items-center justify-center">
                  <FontAwesome6
                    name="person-walking"
                    size={18}
                    color="#f97316"
                  />
                </View>
                <Text className="text-white font-semibold">
                  Najdłuższa trasa
                </Text>
              </View>
              <Text className="text-2xl font-bold text-white">
                {statistics?.longestTrail?.length_km || 0} km
              </Text>
            </View>

            <View className="bg-white/10 rounded-xl p-4 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="bg-purple-500/20 w-10 h-10 rounded-full items-center justify-center">
                  <FontAwesome6 name="mountain" size={18} color="#a855f7" />
                </View>
                <Text className="text-white font-semibold">
                  Najwyższy szczyt
                </Text>
              </View>
              <Text className="text-2xl font-bold text-white">
                {statistics?.highestPeak?.elevation || 0} m
              </Text>
            </View>

            <View className="bg-white/10 rounded-xl p-4">
              <View className="flex-row items-center gap-3 mb-2">
                <View className="bg-cyan-500/20 w-10 h-10 rounded-full items-center justify-center">
                  <FontAwesome6 name="clock" size={18} color="#06b6d4" />
                </View>
                <Text className="text-white font-semibold">Ostatni szczyt</Text>
              </View>
              <Text className="text-xl font-bold text-white ml-13">
                {statistics?.lastPeak?.name || "Brak danych"}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default StatsScreen;
