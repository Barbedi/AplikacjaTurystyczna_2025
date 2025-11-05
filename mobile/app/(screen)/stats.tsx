import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";
import useGetUsers from "@/src/hooks/useGetUser";
import StatBox from "@/src/components/statistics/statBox";
import InfoCard from "@/src/components/statistics/infoCard";
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
        const data = await statisticsService.getStatisticsForUser(currentUser.id);
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
      <LinearGradient colors={["#5996eb", "#050c28"]} className="flex-1 items-center justify-center">
        <ActivityIndicator color="#fff" size="large" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#5996eb", "#050c28"]} className="flex-1">
      <SafeAreaView edges={['bottom', 'left', 'right']} className="flex-1">
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {error && (
            <View className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
              <Text className="text-red-200 text-center">{error}</Text>
            </View>
          )}
          <View className="bg-white/10 rounded-2xl border border-white/30 p-4 mb-5">
            <Text className="text-white text-2xl font-bold text-center mb-4">
              <FontAwesome6 name="mountain-sun" size={20} color="#fff" /> Korona Gór Polski
            </Text>

            <View className="flex-row  justify-between mb-3">
              <StatBox label="Zdobyte" value={statistics?.crowns.kgp.visited || 0} />
              <StatBox label="Wszystkie" value={statistics?.crowns.kgp.all || 0} />
              <StatBox label="Ukończono" value={`${(statistics?.crowns.kgp.percent ?? 0).toFixed(1)}%`} />
            </View>

          </View>

          <View className="bg-white/10 rounded-2xl border border-white/30 p-4 mb-5">
            <Text className="text-white text-2xl font-bold text-center mb-4">
              <FontAwesome6 name="mountain" size={20} color="#fff" /> Korona Beskidu Sądeckiego
            </Text>

            <View className="flex-row justify-between mb-3">
              <StatBox label="Zdobyte" value={statistics?.crowns.kbs.visited || 0} />
              <StatBox label="Wszystkie" value={statistics?.crowns.kbs.all || 0} />
              <StatBox label="Ukończono" value={`${(statistics?.crowns.kbs.percent ?? 0).toFixed(1)}%`} />
            </View>
          </View>
          <View className="flex-col mt-2">
            <InfoCard label="Zdobyte szczyty" icon="crown" value={statistics?.allUserPeaks || 0} />
            <InfoCard label="Trasy" icon="route" value={statistics?.allUserTrails || 0} />
            <InfoCard label="Udostępnione" icon="share" value={statistics?.allUserTrailsShared || 0} />
            <InfoCard
              label="Najdłuższa trasa"
              icon="person-walking"
              value={`${statistics?.longestTrail?.length_km || 0} km`}
            />
            <InfoCard
              label="Najwyższy szczyt"
              icon="mountain"
              value={`${statistics?.highestPeak?.elevation || 0} m`}
            />
            <InfoCard
              label="Ostatni szczyt"
              icon="clock"
              value={statistics?.lastPeak?.name || "Brak danych"}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};


export default StatsScreen;