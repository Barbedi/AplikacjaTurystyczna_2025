import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6";
import { useState, useEffect, useCallback } from "react";
import useGetUsers from "@/src/hooks/useGetUser";
import { Trails } from "@/src/types";
import trailsService from "@/src/services/trails.service";
import { getAuthenticatedUser } from "@/src/config/api";
import { useRouter } from "expo-router";
import { toast } from "@/src/utils/toast";
import {
  getAllowedTrailLevels,
  difficultyLabels,
  fitnessMap,
  experienceMap,
  mapDifficultyToNumber,
} from "@/src/components/propose/proposeTrail";
import favouriteTrailsService from "@/src/services/favouriteTrails.service";

const ProposedScreen = () => {
  const router = useRouter();
  const { getUserByEmail, usersData, loading: userLoading } = useGetUsers();
  const [userLevelLabel, setUserLevelLabel] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [trails, setTrails] = useState<Trails[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

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
    if (currentUser) {
      if (!currentUser.level_of_experience || !currentUser.fitness_level) {
        setUserLevelLabel("Uzupełnij profil !!");
        setIsProfileComplete(false);
        setLoading(false);
        return;
      }

      setIsProfileComplete(true);
      const exp = experienceMap[currentUser.level_of_experience ?? "beginner"];
      const fit = fitnessMap[currentUser.fitness_level ?? "beginner"];
      const [minDiff, maxDiff] = getAllowedTrailLevels(exp, fit);

      if (minDiff === maxDiff) {
        setUserLevelLabel(difficultyLabels[minDiff]);
      } else {
        setUserLevelLabel(
          `${difficultyLabels[minDiff]} – ${difficultyLabels[maxDiff]}`,
        );
      }

      fetchProposedTrails(minDiff, maxDiff);
    } else if (!userLoading) {
      setLoading(false);
    }
  }, [currentUser, userLoading]);

  const fetchFavoriteTrails = useCallback(async () => {
    try {
      const favResponse = await favouriteTrailsService.getFavouriteTrails();
      const favIds = favResponse.data.data.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (favoriteTrail: any) => favoriteTrail.trail_id,
      );
      setFavoriteIds(favIds);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setFavoriteIds([]);
      } else {
        console.error("Error fetching favorite trails:", error);
      }
    }
  }, []);

  const fetchProposedTrails = async (minDiff: number, maxDiff: number) => {
    setLoading(true);
    try {
      let allTrailsData: Trails[] = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const response = await trailsService.getTrailsByPublic(currentPage);
        if (response.data && Array.isArray(response.data.data)) {
          allTrailsData = [...allTrailsData, ...response.data.data];
          totalPages = response.data.totalPages;
        }
        currentPage++;
      } while (currentPage <= totalPages);

      await fetchFavoriteTrails();

      const filtered = allTrailsData.filter((trail) => {
        const difficultyLevel = mapDifficultyToNumber(trail.difficulty);
        return difficultyLevel >= minDiff && difficultyLevel <= maxDiff;
      });

      setTrails(filtered);
    } catch (error) {
      console.error("Error fetching trails:", error);
      toast.error("Błąd", "Nie udało się pobrać tras.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (trailId: number) => {
    try {
      if (favoriteIds.includes(trailId)) {
        await favouriteTrailsService.removeFavouriteTrail(trailId);
        setFavoriteIds((prev) => prev.filter((id) => id !== trailId));
        toast.success("Usunięto z ulubionych");
      } else {
        await favouriteTrailsService.addFavouriteTrail(trailId);
        setFavoriteIds((prev) => [...prev, trailId]);
        toast.success("Dodano do ulubionych");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Błąd", "Nie udało się zaktualizować ulubionych.");
    }
  };

  if (userLoading) {
    return (
      <LinearGradient
        colors={["#5996eb", "#050c28"]}
        className="flex-1 items-center justify-center"
      >
        <ActivityIndicator size="large" color="#fff" />
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
          {!isProfileComplete ? (
            <View className="flex-1 items-center justify-center py-10 gap-6">
              <View className="bg-white/10 p-6 rounded-full">
                <FontAwesome6 name="user-gear" size={64} color="#ffffff80" />
              </View>
              <View className="items-center gap-2">
                <Text className="text-white text-xl font-bold text-center">
                  Uzupełnij swój profil
                </Text>
                <Text className="text-white/60 text-center text-base px-4">
                  Abyśmy mogli dobrać trasy idealne dla Ciebie, musimy znać
                  Twoje doświadczenie i kondycję.
                </Text>
              </View>
              <Pressable
                onPress={() => router.push("/(dashboard)/profile")}
                className="bg-blue-500 px-8 py-3 rounded-xl active:bg-blue-600"
              >
                <Text className="text-white font-semibold text-lg">
                  Przejdź do profilu
                </Text>
              </Pressable>
            </View>
          ) : (
            <View className="flex-col gap-4">
              <View className="bg-white/10 p-4 rounded-xl mb-2">
                <Text className="text-white/70 text-sm text-center">
                  Twoje dopasowanie:
                </Text>
                <Text className="text-white text-lg font-bold text-center mt-1">
                  {userLevelLabel}
                </Text>
              </View>

              {loading ? (
                <ActivityIndicator
                  size="large"
                  color="#fff"
                  className="mt-10"
                />
              ) : trails.length > 0 ? (
                trails.map((trail) => (
                  <Pressable
                    onPress={() => router.push(`/proposed/${trail.id}`)}
                    key={trail.id}
                    className="w-full bg-white/10 rounded-2xl p-4 border-l-4 border-blue-500"
                  >
                    <View className="flex-row items-start justify-between mb-2">
                      <View className="flex-1 mr-2">
                        <Text
                          className="text-lg font-bold text-white"
                          numberOfLines={2}
                        >
                          {trail.name}
                        </Text>
                        <View className="flex-row items-center gap-2 mt-1">
                          <FontAwesome6
                            name="location-dot"
                            size={12}
                            color="#ffffff80"
                          />
                          <Text className="text-white/60 text-xs">
                            {trail.region}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        toggleFavorite(trail.id);
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
                    >
                      <FontAwesome6
                        name="heart"
                        size={26}
                        color={
                          favoriteIds.includes(trail.id)
                            ? "#ef4444"
                            : "#ffffff40"
                        }
                        solid={favoriteIds.includes(trail.id)}
                      />
                    </Pressable>

                    <View className="flex-row items-center gap-3 mt-3">
                      <View className="bg-white/5 px-3 py-1.5 rounded-lg flex-row items-center gap-2">
                        <FontAwesome6 name="route" size={12} color="#60a5fa" />
                        <Text className="text-blue-300 font-semibold text-xs">
                          {trail.length_km} km
                        </Text>
                      </View>
                      <View className="bg-white/5 px-3 py-1.5 rounded-lg flex-row items-center gap-2">
                        <FontAwesome6
                          name="stopwatch"
                          size={12}
                          color="#fbbf24"
                        />
                        <Text className="text-amber-300 font-semibold text-xs">
                          {Math.floor((trail?.duration_minutes || 0) / 60)}h{" "}
                          {(trail?.duration_minutes || 0) % 60}min
                        </Text>
                      </View>
                      <View className="bg-white/5 px-3 py-1.5 rounded-lg flex-row items-center gap-2">
                        <FontAwesome6
                          name="mountain"
                          size={12}
                          color="#a78bfa"
                        />
                        <Text className="text-purple-300 font-semibold text-xs">
                          {trail.difficulty || "Nieznany"}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-sm text-gray-400 text-center mt-2">
                      Dotknij aby zobaczyć szczegóły trasy
                    </Text>
                  </Pressable>
                ))
              ) : (
                <View className="flex-1 items-center justify-center py-10">
                  <FontAwesome6
                    name="person-hiking"
                    size={48}
                    color="#ffffff40"
                  />
                  <Text className="text-white/60 text-center mt-4 text-lg">
                    Brak tras pasujących do Twojego profilu.
                  </Text>
                  <Text className="text-white/40 text-center mt-2 text-sm">
                    Spróbuj zmienić ustawienia w profilu.
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ProposedScreen;
