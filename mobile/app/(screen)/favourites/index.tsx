import { View, Text, ScrollView, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6";
import { useState, useEffect } from "react";
import useGetUsers from "@/src/hooks/useGetUser";
import favouriteTrailsService from "@/src/services/favouriteTrails.service";
import trailsService from "@/src/services/trails.service";
import { getAuthenticatedUser } from "@/src/config/api";
import ConfirmDeleteModal from "@/src/components/ConfirmDeleteModal";
import { FavoriteTrails } from "@/src/types";
import { useRouter } from "expo-router";
import { toast } from "@/src/utils/toast";

const FavouritesScreen = () => {
  const { getUserByEmail, usersData, loading: userLoading } = useGetUsers();
  const [trails, setTrails] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTrailId, setSelectedTrailId] = useState<number | null>(null);

  const router = useRouter();
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
      const fetchFavouriteTrails = async () => {
        try {
          setLoading(true);
          const response = await favouriteTrailsService.getFavouriteTrails();
          const favouriteList = response.data.data;

          if (!favouriteList || favouriteList.length === 0) {
            setTrails([]);
            return;
          }

          const fullTrailResponses = await Promise.all(
            favouriteList.map((fav: FavoriteTrails) =>
              trailsService
                .getTrailById(fav.trail_id)
                .then((res) => ({
                  ...res.data,
                  added_at: fav.added_at,
                }))
                .catch((err) => {
                  console.error(`Error loading trail ${fav.trail_id}:`, err);
                  return null;
                }),
            ),
          );

          const validTrails = fullTrailResponses.filter(
            (trail) => trail !== null,
          );
          setTrails(validTrails);
        } catch (err) {
        } finally {
          setLoading(false);
        }
      };

      fetchFavouriteTrails();
    };
    if (currentUser?.id) loadStats();
  }, [currentUser?.id]);

  const handleDeleteTrail = async (trailId: number) => {
    try {
      await favouriteTrailsService.removeFavouriteTrail(trailId);
      toast.success("Trasa została usunięta");
      setTrails(trails.filter((trail) => trail.id !== trailId));
      setModalVisible(false);
    } catch (error) {
      console.error("Error deleting trail:", error);
      toast.error("Nie udało się usunąć trasy", "Twoje ulubione trasy");
    }
  };
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
                <Pressable
                  onPress={() => router.push(`/favourites/${trail.id}`)}
                  key={trail.id}
                  className="w-full bg-white/10 rounded-2xl p-5 border-l-4 border-red-500"
                >
                  <View className="flex-row items-center gap-3 mb-3">
                    <View className="bg-red-500/20 w-12 h-12 rounded-full items-center justify-center">
                      <FontAwesome6
                        name="heart"
                        size={24}
                        color="#ef4444"
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
                    <Pressable
                      onPress={() => {
                        if (trail.id) {
                          setSelectedTrailId(trail.id);
                          setModalVisible(true);
                        }
                      }}
                    >
                      <View className="bg-red-500/20 w-10 h-10 rounded-full items-center justify-center">
                        <FontAwesome6 name="trash" size={16} color="#ef4444" />
                      </View>
                    </Pressable>
                  </View>
                  <View className="flex-row items-center gap-2 mt-1">
                    <FontAwesome6 name="calendar" size={12} color="#ffffff70" />
                    <Text className="text-white/70 text-xs">
                      Dodano:{" "}
                      {new Date(trail.added_at).toLocaleDateString("pl-PL")}
                    </Text>
                  </View>

                  <Text className="text-sm text-gray-400 text-center mt-2">
                    Dotknij aby zobaczyć szczegóły trasy
                  </Text>
                </Pressable>
              ))
            ) : !loading && !error ? (
              <View className="flex-1 items-center justify-center py-10">
                <FontAwesome6 name="heart" size={48} color="#ffffff40" />
                <Text className="text-white/60 text-center mt-4 text-lg">
                  Nie polubiłeś żadnej trasy.
                </Text>
                <Text className="text-white/40 text-center mt-2 text-sm">
                  Rozpocznij swoją przygodę górską!
                </Text>
              </View>
            ) : null}
            <ConfirmDeleteModal
              visible={modalVisible}
              title="Usuń trasę z ulubionych?"
              message="Czy na pewno chcesz usunąć tę trasę z ulubionych? Tej operacji nie można cofnąć."
              onCancel={() => setModalVisible(false)}
              onConfirm={() => {
                if (selectedTrailId !== null) {
                  handleDeleteTrail(selectedTrailId);
                }
              }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default FavouritesScreen;
