import { View, Text, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import useGetUsers from "@/src/hooks/useGetUser";
import userpeaksService from "@/src/services/userpeaks.service";
import { getAuthenticatedUser } from "@/src/config/api";

const PeaksScreen = () => {
  const { getUserByEmail, usersData, loading: userLoading } = useGetUsers();
  const [peaks, setPeaks] = useState<any>(null);
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
        const response = await userpeaksService.getUserPeaks(currentUser.id);
        const { data, total, limit } = response.data;

        setPeaks(data || []);
      } catch (err) {
        console.error(err);
        setError("Nie udało się załadować szczytów.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.id) loadStats();
  }, [currentUser?.id]);
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
              <Text className="text-white text-center">
                Ładowanie szczytów...
              </Text>
            )}

            {error && (
              <View className="bg-red-500/20 p-4 rounded-xl">
                <Text className="text-red-400 text-center">{error}</Text>
              </View>
            )}

            {!loading && !error && peaks && peaks.length > 0 ? (
              peaks.map((peak: any, index: number) => (
                <View
                  key={index}
                  className="w-full bg-white/10 rounded-2xl p-5 border-l-4 border-yellow-500"
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center gap-3">
                      <View className="bg-yellow-500/20 w-12 h-12 rounded-full items-center justify-center">
                        <FontAwesome6 name="crown" size={24} color="#eab308" />
                        <Text className=" absolute top-5 right-4.1 text-white font-semibold text-xs">
                          {peak.times_visited}{" "}
                        </Text>
                      </View>
                      <View>
                        <Text className="text-2xl font-bold text-white">
                          {peak.peak_name || "Nieznany szczyt"}
                        </Text>
                        <Text className="text-sm text-white/70">
                          {peak.elevation || "?"} m n.p.m.
                        </Text>
                      </View>
                    </View>
                    <View className="bg-green-500/20 px-3 py-1 rounded-full">
                      <Text className="text-green-400 font-semibold text-xs">
                        ZDOBYTY
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center gap-2 mt-2">
                    <FontAwesome6 name="calendar" size={14} color="#ffffff90" />
                    <Text className="text-white/70 text-sm">
                      {peak.last_visited
                        ? new Date(peak.last_visited).toLocaleDateString(
                            "pl-PL",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )
                        : "Brak daty"}
                    </Text>
                  </View>
                </View>
              ))
            ) : !loading && !error ? (
              <View className="flex-1 items-center justify-center py-10">
                <FontAwesome6 name="mountain" size={48} color="#ffffff40" />
                <Text className="text-white/60 text-center mt-4 text-lg">
                  Nie zdobyłeś jeszcze żadnych szczytów
                </Text>
                <Text className="text-white/40 text-center mt-2 text-sm">
                  Rozpocznij swoją przygodę górską!
                </Text>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};
export default PeaksScreen;
