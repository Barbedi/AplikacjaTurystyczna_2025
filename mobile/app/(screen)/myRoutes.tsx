import { View, Text, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6";
import { useState, useEffect } from "react";
import useGetUsers from "@/src/hooks/useGetUser";
import { Trails } from "@/src/types";
import trailsService from "@/src/services/trails.service";
import { getAuthenticatedUser } from "@/src/config/api";

const MyRoutesScreen = () => {
  const { getUserByEmail, usersData, loading: userLoading } = useGetUsers();
  const [trails, setTrails] = useState<Trails[]>([]);
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
        const response = await trailsService.getTrailsByUser(
          currentUser.id.toString(),
        );
        const { data, limit } = response.data;

        setTrails(data || []);
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
                Ładowanie twoich tras...
              </Text>
            )}

            {error && (
              <View className="bg-red-500/20 p-4 rounded-xl">
                <Text className="text-red-400 text-center">{error}</Text>
              </View>
            )}

            {!loading && !error && trails && trails.length > 0 ? (
              trails.map((trail) => (
                <View
                  key={trail.id}
                  className="w-full bg-white/10 rounded-2xl p-5 border-l-4 border-green-500"
                >
                  <View className="flex-row items-center gap-3 mb-3">
                    <View className="bg-green-500/30 w-12 h-12 rounded-full items-center justify-center">
                      <FontAwesome6
                        name="location-pin-lock"
                        size={24}
                        color="#22c55e"
                        solid
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xl font-bold text-white">
                        {trail.name}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center justify-between">
                    <View className="flex-row gap-3">
                      <View className="bg-purple-500/20 px-3 py-1.5 rounded-full">
                        <Text className="text-purple-300 font-semibold text-xs">
                          {trail.region}
                        </Text>
                      </View>
                      <View className="bg-green-500/20 px-3 py-1.5 rounded-full">
                        <Text className="text-green-400 font-semibold text-xs">
                          {trail.length_km} km
                        </Text>
                      </View>
                    </View>

                    <View className="bg-red-500/20 w-10 h-10 rounded-full items-center justify-center">
                      <FontAwesome6 name="trash" size={18} color="#ef4444" />
                    </View>
                  </View>
                  <Text className="text-sm text-gray-400 text-center mt-2">
                    Dotknij aby zobaczyć szczegóły trasy
                  </Text>
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

export default MyRoutesScreen;
