import { useLocalSearchParams, useRouter, useNavigation, useFocusEffect } from "expo-router";
import { View, Text, Pressable, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState, useCallback } from "react";
import trailsService from "@/src/services/trails.service";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6";
import { RouteType, Trails } from "@/src/types";
import Charts from "@/src/components/Route/Charts";
import MapsRoute from "@/src/components/Route/MapsRoute";
import Photo from "@/src/components/Route/Photo";
import { getRouteTypeLabel } from "@/src/utils/routeTypeLabels";

const TrailsDetails = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [trail, setTrail] = useState<Trails>();
  const [isMapVisible, setIsMapVisible] = useState(true);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [isPhotosVisible, setIsPhotosVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchPeak = async () => {
        try {
          const trailId = Array.isArray(id)
            ? parseInt(id[0])
            : parseInt(id as string);
          const res = await trailsService.getTrailById(trailId);
          setTrail(res.data);
          navigation.setOptions({
            title: res.data.name || "Trasa",
          });
        } catch (error) {
          console.error("Błąd pobierania trasy:", error);
        }
      };
      if (id) fetchPeak();
    }, [id])
  );

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
            <View className="flex-row gap-4 mt-4">
              <View className="flex-row bg-green-500/30 px-2 py-1.5 rounded-full items-center justify-center mb-3">
                <FontAwesome6 name="mountain" size={15} color="#22c55e" />
                <Text className=" text-md font-bold ml-1 text-green-500">
                  {trail?.region}
                </Text>
              </View>
              <View className="flex-row bg-red-500/30 px-2 py-1.5 rounded-full items-center justify-center mb-3">
                <FontAwesome6
                  name="fire-flame-curved"
                  size={15}
                  color="#ef4444"
                />
                <Text className=" text-md font-bold ml-1 text-red-500">
                  {trail?.difficulty}
                </Text>
              </View>
              <View className="flex-row bg-yellow-500/30 px-2 py-1.5 rounded-full items-center justify-center mb-3">
                <FontAwesome6 name="calendar" size={15} color="#eab308" />
                <Text className=" text-md font-bold ml-1 text-yellow-500">
                  {trail?.created_at?.split("T")[0]}
                </Text>
              </View>
            </View>
            <View className=" flex-col gap-4  w-full p-5 rounded-2xl justify-center items-center">
              <View className="flex-row gap-4">
                <View className="bg-white/30 p-5 w-1/2 h-24 rounded-2xl items-center justify-start">
                  <View className="flex-row items-center gap-1">
                    <FontAwesome6 name="route" size={15} color="#ffffff" />
                    <Text className="text-white text-md ">Długość</Text>
                  </View>
                  <Text className="text-white text-2xl font-bold">
                    {trail?.length_km} km
                  </Text>
                </View>
                <View className="bg-white/30 p-5 w-1/2 h-24 rounded-2xl items-center justify-start">
                  <View className="flex-row items-center gap-1">
                    <FontAwesome6 name="clock" size={15} color="#ffffff" />
                    <Text className="text-white text-md ">Czas przejścia</Text>
                  </View>
                  <Text className="text-white text-2xl font-bold">
                    {Math.floor((trail?.duration_minutes || 0) / 60)}h{" "}
                    {(trail?.duration_minutes || 0) % 60}min
                  </Text>
                </View>
              </View>
              <View className="flex-row gap-4">
                <View className="bg-white/30 p-5 w-1/2 h-24 rounded-2xl items-center justify-start">
                  <View className="flex-row items-center gap-1">
                    <FontAwesome6 name="mountain" size={15} color="#ffffff" />
                    <Text className="text-white text-md ">Przewyższenie</Text>
                  </View>
                  <Text className="text-white text-2xl font-bold">
                    {trail?.elevation_gain} m
                  </Text>
                </View>
                <View className="bg-white/30 p-5 w-1/2 h-24 rounded-2xl items-center justify-start">
                  <View className="flex-row items-center gap-1">
                    <FontAwesome6 name="map" size={15} color="#ffffff" />
                    <Text className="text-white text-md ">Typ trasy</Text>
                  </View>
                  <Text
                    className="text-white text-2xl font-bold text-center"
                    numberOfLines={2}
                    adjustsFontSizeToFit
                  >
                    {getRouteTypeLabel(trail?.route_type as RouteType)}
                  </Text>
                </View>
              </View>
            </View>
            <View className="bg-white/10 rounded-2xl p-2 mt-3 w-full flex-row">
              <Pressable
                className={`flex-1 py-2 rounded-xl justify-center items-center mr-2 ${isMapVisible ? "bg-purple-500" : "bg-transparent"}`}
                onPress={() => {
                  setIsMapVisible(true);
                  setIsProfileVisible(false);
                  setIsPhotosVisible(false);
                }}
              >
                <FontAwesome6
                  name="map-location-dot"
                  size={20}
                  color={isMapVisible ? "#ffffff" : "#ffffff"}
                />
                <Text
                  className={`text-center text-sm font-bold mt-1 ${isMapVisible ? "text-white" : "text-white"}`}
                >
                  Mapa
                </Text>
              </Pressable>

              <Pressable
                className={`flex-1 py-2 rounded-xl justify-center items-center mx-1 ${isProfileVisible ? "bg-purple-500" : "bg-transparent"}`}
                onPress={() => {
                  setIsMapVisible(false);
                  setIsProfileVisible(true);
                  setIsPhotosVisible(false);
                }}
              >
                <FontAwesome6
                  name="chart-area"
                  size={20}
                  color={isProfileVisible ? "#ffffff" : "#ffffff"}
                />
                <Text
                  className={`text-center text-sm font-bold mt-1 ${isProfileVisible ? "text-white" : "text-white"}`}
                >
                  Profil
                </Text>
              </Pressable>

              <Pressable
                className={`flex-1 py-2 rounded-xl justify-center items-center ml-2 ${isPhotosVisible ? "bg-purple-500" : "bg-transparent"}`}
                onPress={() => {
                  setIsMapVisible(false);
                  setIsProfileVisible(false);
                  setIsPhotosVisible(true);
                }}
              >
                <FontAwesome6
                  name="images"
                  size={20}
                  color={isPhotosVisible ? "#ffffff" : "#ffffff"}
                />
                <Text
                  className={`text-center text-sm font-bold mt-1 ${isPhotosVisible ? "text-white" : "text-white"}`}
                >
                  Zdjęcia
                </Text>
              </Pressable>
            </View>

            <View className="mt-5 w-full">
              {isMapVisible && (
                <View className="bg-white/10 rounded-2xl overflow-hidden w-full h-96">
                  <MapsRoute
                    trail={trail}
                    peakCoordinate={
                      trail?.geometry?.coordinates?.[0] as [number, number]
                    }
                    trailPoints={trail?.points}
                  />
                </View>
              )}
              {isProfileVisible && (
                <View className="bg-white/15 rounded-2xl p-5 w-full overflow-hidden justify-center items-center">
                  <Charts trail={trail} />
                </View>
              )}
              {isPhotosVisible && (
                <View className=" w-full items-center">
                  <Photo 
                    trailId={trail?.id || 0} 
                    initialPhotos={trail?.photos} 
                    onPhotosUpdate={(updatedTrail) => {
                        if (updatedTrail) {
                            setTrail(updatedTrail);
                        } else if (id) {
                            const trailId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id as string);
                            trailsService.getTrailById(trailId).then(res => setTrail(res.data));
                        }
                    }}
                  />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default TrailsDetails;
