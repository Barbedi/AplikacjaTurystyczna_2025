import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useState, useEffect } from "react";
import useGetUsers from "@/src/hooks/useGetUser";
import communityTrailsService from "@/src/services/communitytrails.service";
import { getAuthenticatedUser } from "@/src/config/api";
import ConfirmDeleteModal from "@/src/components/ConfirmDeleteModal";
import { useRouter } from "expo-router";
import { toast } from "@/src/utils/toast";
import trailsService from "@/src/services/trails.service";
import filesService from "@/src/services/file.service";

const SharedScreen = () => {
  const { getUserByEmail, usersData } = useGetUsers();
  const [trails, setTrails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSharedId, setSelectedSharedId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Load logged user
  useEffect(() => {
    const loadUser = async () => {
      const authData = await getAuthenticatedUser();
      if (authData?.user?.email) {
        await getUserByEmail(authData.user.email);
      }
    };
    loadUser();
  }, []);

  const currentUser = usersData?.[0]?.[0];

  // Load shared trails
  useEffect(() => {
    const loadShared = async () => {
      setLoading(true);

      try {
        const sharedResponse = await communityTrailsService.getCommunityTrails();
        const sharedList = sharedResponse.data;

        const fullTrails = await Promise.all(
          sharedList.map(async (item: any) => {
            try {
              const res = await trailsService.getTrailById(item.trail_id);
              return {
                ...res.data,
                shared_id: item.shared_id,
                user_id: item.user_id,
                user_name: item.user_name,
                user_image: item.user_profile_image,
                created_at: item.created_at,
              };
            } catch {
              return null;
            }
          })
        );

        setTrails(fullTrails.filter((t) => t !== null));
      } finally {
        setLoading(false);
      }
    };

    loadShared();
  }, [currentUser?.id]);

  const handleDelete = async () => {
    if (!selectedSharedId) return;

    try {
      await communityTrailsService.deleteCommunityTrail(selectedSharedId);
      toast.success("Udostępnienie usunięte");
      setTrails(trails.filter((t) => t.shared_id !== selectedSharedId));
    } catch {
      toast.error("Nie udało się usunąć");
    } finally {
      setModalVisible(false);
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
                key={trail.shared_id}
                onPress={() => router.push(`/shared/${trail.shared_id}`)}
                className="w-full bg-white/10 rounded-2xl p-5 border-l-4 border-blue-500"
              >
                <View className="flex-row items-center gap-3 mb-3">
                  <Image
                    source={{
                      uri: filesService.getImgUrl(trail.user_image),
                    }}
                    className="w-12 h-12 rounded-full bg-white/20"
                  />
                  <View className="flex-1">
                    <Text className="text-xl font-bold text-white">
                      {trail.user_name}
                    </Text>
                    <Text className="text-white/60 text-sm">
                      Udostępnił:{" "}
                      {new Date(trail.created_at).toLocaleDateString("pl-PL")}
                    </Text>
                  </View>
                  {currentUser?.id === trail.user_id && (
                    <Pressable
                      onPress={() => {
                        setSelectedSharedId(trail.shared_id);
                        setModalVisible(true);
                      }}
                    >
                      <View className="bg-red-500/20 w-10 h-10 rounded-full items-center justify-center">
                        <FontAwesome6 name="trash" size={16} color="#ef4444" />
                      </View>
                    </Pressable>
                  )}
                </View>
                <View className="bg-white/20 px-4 py-2 rounded-xl">
                  <Text className="text-white font-semibold text-base">
                    {trail.name}
                  </Text>
                </View>
                <Text className="text-sm text-gray-400 text-center mt-2">
                  Dotknij aby zobaczyć wątek
                </Text>
              </Pressable>
            ))
          ) : !loading && !error ? (
            <View className="flex-1 items-center justify-center py-10">
              <FontAwesome6 name="share-nodes" size={48} color="#ffffff40" />
              <Text className="text-white/70 mt-4 text-lg">
                Brak udostępnionych tras
              </Text>
              <Text className="text-white/40 mt-1">
                Udostępnij swoją pierwszą trasę!
              </Text>
            </View>
          ) : null}

          {/* Delete modal */}
          <ConfirmDeleteModal
            visible={modalVisible}
            title="Usuń udostępnienie?"
            message="Czy na pewno chcesz cofnąć udostępnienie? Operacji nie można cofnąć."
            onCancel={() => setModalVisible(false)}
            onConfirm={handleDelete}
          />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SharedScreen;
