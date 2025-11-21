import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { View, Text, Pressable, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import trailsService from "@/src/services/trails.service";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6";
import { Trails } from "@/src/types";
import Charts from "@/src/components/Route/Charts";


const TrailsDetails = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [trail, setTrail] = useState<Trails>();
  const [isMapVisible, setIsMapVisible] = useState(true);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [isPhotosVisible, setIsPhotosVisible] = useState(false);

   useEffect(() => {
      const fetchPeak = async () => {
        try {
          const trailId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id as string);
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
    }, [id]);

 
  

  

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
                    <FontAwesome6 name="fire-flame-curved" size={15} color="#ef4444" />
                    <Text className=" text-md font-bold ml-1 text-red-500">
                        {trail?.difficulty}
                    </Text>
                </View>
            </View>
            <View className=" flex-col gap-4  w-full p-5 rounded-2xl justify-center items-center">
              <View className="flex-row gap-4">
                <View className="bg-white/30 p-5 w-1/2 h-24 rounded-2xl items-center justify-start" >
                    <Text className="text-white text-md">Długość</Text>
                    <Text className="text-white text-2xl font-bold">{trail?.length_km} km</Text>
                </View>
                <View className="bg-white/30 p-5 w-1/2 h-24 rounded-2xl items-center justify-start">
                    <Text className="text-white text-md">Czas przejścia</Text>
                    <Text className="text-white text-2xl font-bold">{trail?.duration_minutes} min</Text>
                </View>
              </View>
              <View className="flex-row gap-4">
                <View className="bg-white/30 p-5 w-1/2 h-24 rounded-2xl items-center justify-start">
                    <Text className="text-white text-md">Przewyższenie</Text>
                    <Text className="text-white text-2xl font-bold">{trail?.elevation_gain} m</Text>
                </View>
                <View className="bg-white/30 p-5 w-1/2 h-24 rounded-2xl items-center justify-start">
                    <Text className="text-white text-md">Typ trasy</Text>
                    <Text className="text-white text-2xl font-bold">{trail?.route_type}</Text>
                </View>
              </View>
            </View>
           <View className="bg-white/10 rounded-2xl p-2 mt-3 w-full flex-row">
  <Pressable
    className={`flex-1 py-2 rounded-xl justify-center items-center mr-2 ${isMapVisible ? "bg-yellow-400" : "bg-transparent"}`}
    onPress={() => {
      setIsMapVisible(true);
      setIsProfileVisible(false);
      setIsPhotosVisible(false);
    }}
  >
    <FontAwesome6
      name="map-location-dot"
      size={20}
      color={isMapVisible ? "#050c28" : "#ffffff"}
    />
    <Text className={`text-center text-sm font-bold mt-1 ${isMapVisible ? "text-slate-900" : "text-white"}`}>
      Mapa
    </Text>
  </Pressable>

  <Pressable
    className={`flex-1 py-2 rounded-xl justify-center items-center mx-1 ${isProfileVisible ? "bg-yellow-400" : "bg-transparent"}`}
    onPress={() => {
      setIsMapVisible(false);
      setIsProfileVisible(true);
      setIsPhotosVisible(false);
    }}
  >
    <FontAwesome6
      name="chart-area"
      size={20}
      color={isProfileVisible ? "#050c28" : "#ffffff"}
    />
    <Text className={`text-center text-sm font-bold mt-1 ${isProfileVisible ? "text-slate-900" : "text-white"}`}>
      Profil
    </Text>
  </Pressable>

  <Pressable
    className={`flex-1 py-2 rounded-xl justify-center items-center ml-2 ${isPhotosVisible ? "bg-yellow-400" : "bg-transparent"}`}
    onPress={() => {
      setIsMapVisible(false);
      setIsProfileVisible(false);
      setIsPhotosVisible(true);
    }}
  >
    <FontAwesome6
      name="images"
      size={20}
      color={isPhotosVisible ? "#050c28" : "#ffffff"}
    />
    <Text className={`text-center text-sm font-bold mt-1 ${isPhotosVisible ? "text-slate-900" : "text-white"}`}>
      Zdjęcia
    </Text>
  </Pressable>
</View>


            <View className="mt-5 w-full">
              {isMapVisible && (
                <View className="bg-white/10 rounded-2xl p-5 w-full items-center">
                  <Text className="text-white text-lg">Tu będzie mapa</Text>
                </View>
              )}
              {isProfileVisible && (
                <View className="bg-white/15 rounded-2xl p-5 w-full overflow-hidden justify-center items-center">
                  <Charts />
                </View>
              )}
              {isPhotosVisible && (
                <View className="bg-white/10 rounded-2xl p-5 w-full items-center">
                  <Text className="text-white text-lg">Tu będą zdjęcia</Text>
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
