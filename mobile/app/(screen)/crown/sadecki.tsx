import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import useGetUsers from "@/src/hooks/useGetUser";
import peaksService from "@/src/services/peaks.service";
import userpeaksService from "@/src/services/userpeaks.service";
import { getAuthenticatedUser } from "@/src/config/api";
interface PeakWithVerification {
  id: number;
  name: string;
  elevation: number;
  verified?: boolean;
}

const SadeckiCrown = () => {
  const router = useRouter();
  const { getUserByEmail, usersData } = useGetUsers();
  const [peaks, setPeaks] = useState<PeakWithVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const authData = await getAuthenticatedUser();
        if (authData?.user?.email) {
          await getUserByEmail(authData.user.email);
        }
      } catch (error) {
        console.error("Błąd ładowania użytkownika:", error);
      }
    };
    loadUser();
  }, [getUserByEmail]);

  const currentUser = usersData?.[0]?.[0];

  useEffect(() => {
    const loadPeaks = async () => {
      if (!currentUser?.id) return;

      setLoading(true);
      try {
        const response = await peaksService.getCrownBeskid(1, true);
        const peaksData = response.data.data;

        const peaksWithVerification = await Promise.all(
          peaksData.map(async (peak: any) => {
            try {
              const userPeakResponse = await userpeaksService.getUserPeakById(
                currentUser.id!,
                peak.id,
              );
              return {
                ...peak,
                verified: userPeakResponse.data.data.verified || false,
              };
            } catch {
              return {
                ...peak,
                verified: false,
              };
            }
          }),
        );

        setPeaks(peaksWithVerification);
      } catch (err) {
        console.error("Error loading peaks:", err);
        setError("Nie udało się załadować szczytów.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.id) loadPeaks();
  }, [currentUser?.id, page]);
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
              peaks.map((peak) => (
                <Pressable
                  onPress={() => router.push(`/crown/${peak.id}`)}
                  key={peak.id}
                  className="w-full bg-white/10 rounded-2xl p-5 border-l-4 border-purple-500 active:bg-white/20"
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center gap-3 flex-1">
                      <View className="bg-purple-500/20 w-12 h-12 rounded-full items-center justify-center">
                        <FontAwesome6
                          name="mountain"
                          size={24}
                          color="#a855f7"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-xl font-bold text-white">
                          {peak.name}
                        </Text>
                        <Text className="text-sm text-white/70">
                          {peak.elevation} m n.p.m.
                        </Text>
                      </View>
                    </View>
                    <View
                      className={`${
                        peak.verified ? "bg-green-500/20" : "bg-red-500/20"
                      } px-3 py-1.5 rounded-full`}
                    >
                      <Text
                        className={`${
                          peak.verified ? "text-green-400" : "text-red-400"
                        } font-semibold text-xs`}
                      >
                        {peak.verified ? "ZDOBYTY" : "NIEZDOBYTY"}
                      </Text>
                    </View>
                  </View>

                  <Text className="text-sm text-gray-400 text-center mt-2">
                    Dotknij aby zobaczyć szczegóły szczytu
                  </Text>
                </Pressable>
              ))
            ) : !loading && !error ? (
              <View className="flex-1 items-center justify-center py-10">
                <FontAwesome6 name="mountain" size={48} color="#ffffff40" />
                <Text className="text-white/60 text-center mt-4 text-lg">
                  Brak szczytów do wyświetlenia
                </Text>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SadeckiCrown;
