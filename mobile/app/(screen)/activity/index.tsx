import { View, Text, ScrollView, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useState, useEffect } from "react";
import useGetUsers from "@/src/hooks/useGetUser";
import trackingRecordingService from "@/src/services/trackingRecording.service";
import ConfirmDeleteModal from "@/src/components/ConfirmDeleteModal";
import { useRouter } from "expo-router";
import { toast } from "@/src/utils/toast";
import { getAuthenticatedUser } from "@/src/config/api";

interface Recording {
  id: number;
  name: string | null;
  distance_m: number;
  duration_ms: number;
  created_at: string;
}

const MyRecordingsScreen = () => {
  const router = useRouter();
  const { getUserByEmail, usersData } = useGetUsers();

  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

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

  // Load recordings
  useEffect(() => {
    const load = async () => {
      if (!currentUser?.id) return;
      setLoading(true);

      try {
        const res = await trackingRecordingService.getRoutesByUser(currentUser.id);
        setRecordings(res.data.data || []);
      } catch (e) {
        console.error(e);
        setError("Nie udało się pobrać aktywności.");
      } finally {
        setLoading(false);
      }
    };
    if (currentUser?.id) load();
  }, [currentUser?.id]);

  const handleDelete = async (id: number) => {
    try {
      await trackingRecordingService.deleteRoute(id, currentUser?.id as number);
      setRecordings(recordings.filter(r => r.id !== id));
      toast.success("Aktywność została usunięta");
      setModalVisible(false);
    } catch (e) {
      console.error(e);
      toast.error("Nie udało się usunąć aktywności");
    }
  };

  return (
    <LinearGradient colors={["#5996eb", "#050c28"]} className="flex-1">
      <SafeAreaView className="flex-1" edges={["left", "right", "bottom"]}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 20,
            flexGrow: 1,
          }}
        >
          {loading && <Text className="text-white text-center">Ładowanie…</Text>}

          {error && (
            <View className="bg-red-500/20 p-4 rounded-xl">
              <Text className="text-red-400 text-center">{error}</Text>
            </View>
          )}

          {!loading && !error && recordings.length > 0 ? (
            recordings.map((rec) => {
              const distKm = (rec.distance_m / 1000).toFixed(2);
              const durationMin = Math.floor(rec.duration_ms / 60000);

              return (
                <Pressable
                  key={rec.id}
                  onPress={() => router.push(`/(screen)/activity/${rec.id}`)}
                  className="w-full bg-white/10 rounded-2xl p-5 border-l-4 border-green-500 mb-4"
                >
                  <View className="flex-row items-center gap-3 mb-3">
                    <View className="bg-green-500/30 w-12 h-12 rounded-full items-center justify-center">
                      <FontAwesome6 name="person-hiking" size={22} color="#22c55e" />
                    </View>

                    <View className="flex-1">
                      <Text className="text-xl font-bold text-white">
                        {rec.name || "Aktywność GPS"}
                      </Text>
                      <Text className="text-white/60 text-xs">
                        {new Date(rec.created_at).toLocaleDateString("pl-PL")}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center justify-between">
                    <View className="flex-row gap-3">
                      <View className="bg-purple-500/20 px-3 py-1.5 rounded-full">
                        <Text className="text-purple-300 font-semibold text-xs">
                          {distKm} km
                        </Text>
                      </View>
                      <View className="bg-blue-500/20 px-3 py-1.5 rounded-full">
                        <Text className="text-blue-300 font-semibold text-xs">
                          {durationMin} min
                        </Text>
                      </View>
                    </View>

                    <Pressable
                      onPress={() => {
                        setSelectedId(rec.id);
                        setModalVisible(true);
                      }}
                    >
                      <View className="bg-red-500/20 w-10 h-10 rounded-full items-center justify-center">
                        <FontAwesome6 name="trash" size={16} color="#ef4444" />
                      </View>
                    </Pressable>
                  </View>

                  <Text className="text-sm text-gray-400 text-center mt-2">
                    Dotknij aby zobaczyć szczegóły aktywności
                  </Text>
                </Pressable>
              );
            })
          ) : (
            !loading &&
            !error && (
              <View className="flex-1 items-center justify-center py-10">
                <FontAwesome6 name="person-hiking" size={48} color="#ffffff40" />
                <Text className="text-white/60 text-center mt-4 text-lg">
                  Nie masz jeszcze żadnych nagrań GPS.
                </Text>
                <Text className="text-white/40 text-center mt-2 text-sm">
                  Rozpocznij zapis trasy, by zobaczyć je tutaj.
                </Text>
              </View>
            )
          )}

          <ConfirmDeleteModal
            visible={modalVisible}
            title="Usuń aktywność?"
            message="Czy na pewno chcesz usunąć tę aktywność? Tej operacji nie można cofnąć."
            onCancel={() => setModalVisible(false)}
            onConfirm={() => {
              if (selectedId !== null) handleDelete(selectedId);
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default MyRecordingsScreen;
