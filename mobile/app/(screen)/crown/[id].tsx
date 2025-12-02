import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { View, Text, Pressable, ScrollView, Image, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import peaksService from "@/src/services/peaks.service";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6";
import { Peaks, UserPeak } from "@/src/types";
import MapInfo from "@/src/components/map/mapinfo";
import userpeaksService from "@/src/services/userpeaks.service";
import { getAuthenticatedUser } from "@/src/config/api";
import useGetUsers from "@/src/hooks/useGetUser";
import filesService from "@/src/services/file.service";
import { formatDate2 } from "@/src/utils/format";

const PeakDetails = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const [peak, setPeak] = useState<Peaks>();
  const [isMapVisible, setIsMapVisible] = useState(true);
  const [userPeak, setUserPeak] = useState<UserPeak>();
  const { getUserByEmail, usersData } = useGetUsers();

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
    const fetchPeak = async () => {
      try {
        const res = await peaksService.getById(id as string);
        setPeak(res.data.data);

        navigation.setOptions({ title: res.data.data.name || "Szczyt" });
      } catch (error) {
        console.error("Błąd pobierania szczytu:", error);
      }
    };

    if (id) fetchPeak();
  }, [id]);
  useEffect(() => {
    const fetchUserPeak = async () => {
      if (!currentUser?.id || !id) return;

      try {
        const res = await userpeaksService.getUserPeakById(
          currentUser.id,
          Number(id),
        );
        setUserPeak(res.data.data);
      } catch (error) {
        
      }
    };

    fetchUserPeak();
  }, [id, currentUser?.id]);

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
          <View className="flex justify-center items-center">
            <FontAwesome6 name="mountain" size={90} color="#ffffff" />

            <View className="w-full mt-6">
              <Text className="text-white text-lg font-bold mb-4 ml-1">
                Informacje o szczycie
              </Text>

              <View className="flex-row flex-wrap justify-between gap-y-4">
                <View className="w-[48%] bg-white/10 p-4 rounded-2xl items-center border border-white/5">
                  <FontAwesome6 name="mountain" size={20} color="#60a5fa" />
                  <Text className="text-white/60 text-xs uppercase">
                    Wysokość
                  </Text>
                  <Text className="text-white text-lg font-bold">
                    {peak?.elevation} m
                  </Text>
                </View>

                <View className="w-[48%] bg-white/10 p-4 rounded-2xl items-center border border-white/5">
                  <FontAwesome6
                    name="map-location-dot"
                    size={20}
                    color="#c084fc"
                  />
                  <Text className="text-white/60 text-xs uppercase">
                    Region
                  </Text>
                  <Text className="text-white text-lg font-bold">
                    {peak?.region}
                  </Text>
                </View>

                <View className="w-[48%] bg-white/10 p-4 rounded-2xl items-center border border-white/5">
                  <FontAwesome6 name="trophy" size={20} color="#facc15" />
                  <Text className="text-white/60 text-xs uppercase">
                    Status
                  </Text>
                  <Text className="text-white text-lg font-bold">
                    {userPeak?.verified ? "Zweryfikowany" : "Niezweryfikowany"}
                  </Text>
                </View>

                <View className="w-[48%] bg-white/10 p-4 rounded-2xl items-center border border-white/5">
                  <FontAwesome6 name="location-dot" size={20} color="#4ade80" />
                  <Text className="text-white/60 text-xs uppercase">
                    Odległość
                  </Text>
                  <Text className="text-white text-lg font-bold">
                    {userPeak?.distance_from_peak
                      ? `${userPeak.distance_from_peak} m`
                      : "Brak"}
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row gap-5 mt-5 w-full justify-center p-2">
              <Pressable
                className={`w-1/2 py-2 rounded-lg ${
                  isMapVisible ? "bg-white/10 border border-white/20" : ""
                }`}
                onPress={() => setIsMapVisible(true)}
              >
                <Text className="text-xl text-center font-semibold text-white">
                  Mapa
                </Text>
              </Pressable>

              <Pressable
                className={`w-1/2 py-2 rounded-lg ${
                  !isMapVisible ? "bg-white/10 border border-white/20" : ""
                }`}
                onPress={() => setIsMapVisible(false)}
              >
                <Text className="text-xl text-center font-semibold text-white ">
                  Zdjęcie
                </Text>
              </Pressable>
            </View>
            <View className="mt-5 w-full h-[490px]">
              {isMapVisible ? (
                <View className="flex-1 rounded-2xl overflow-hidden">
                  <MapInfo
                    peakCoordinate={
                      peak?.longitude && peak?.latitude
                        ? [peak.longitude, peak.latitude]
                        : undefined
                    }
                  />
                </View>
              ) : (
                <View className="bg-white/10 p-2 rounded-2xl h-full justify-center items-center">
                  {userPeak?.photo_url ? (
                    <View className="w-full h-full rounded-2xl overflow-hidden ">
                      <Image
                        source={{
                          uri: filesService.getPeakImgUrl(userPeak.photo_url),
                        }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />

                      <LinearGradient
                        colors={[
                          "transparent",
                          "rgba(0,0,0,0.4)",
                          "rgba(0,0,0,0.85)",
                        ]}
                        className="absolute bottom-0 left-0 right-0 pt-12 pb-4 px-4"
                      >
                        <View className="items-center gap-1">
                          <Text className="text-white text-2xl font-bold">
                            {peak?.name}
                          </Text>

                          <View className="flex-row items-center gap-2 mt-1">
                            <FontAwesome6
                              name="calendar-check"
                              size={14}
                              color="#a1a1aa"
                            />
                            <Text className="text-zinc-400 text-sm font-medium">
                              {formatDate2(userPeak?.visited_at)}
                            </Text>
                          </View>
                        </View>
                      </LinearGradient>
                    </View>
                  ) : (
                    <View className="flex-1 justify-center items-center px-6">
                      <View className="items-center mb-8">
                        <View className="bg-white/10 rounded-full p-6 mb-4">
                          <FontAwesome6
                            name="image"
                            size={48}
                            color="#60a5fa"
                          />
                        </View>

                        <Text className="text-white text-xl font-bold text-center mb-2">
                          Brak zdjęcia
                        </Text>

                        <Text className="text-white/60 text-sm text-center">
                          Dodaj zdjęcie ze szczytu na stronie internetowej
                        </Text>
                      </View>
                      <View className="bg-blue-500/30 border border-blue-400/30 px-4 py-2 rounded-full flex-col items-center gap-2 ">
                        <FontAwesome6
                          name="circle-info"
                          size={24}
                          color="#ffffff"
                        />
                        <Text className="text-white text-center">
                          Weryfikacja GPS dostępna tylko na stronie
                          internetowej.
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default PeakDetails;
