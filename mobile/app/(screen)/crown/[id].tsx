import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { View, Text, Pressable, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import peaksService from "@/src/services/peaks.service";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6";
import { Peaks } from "@/src/types";
import MapInfo from "@/src/components/map/mapinfo";
import * as ImagePicker from "expo-image-picker";

const PeakDetails = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [peak, setPeak] = useState<Peaks>();
  const [isMapVisible, setIsMapVisible] = useState(true);
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // crop
      aspect: [4, 3], // proporcje
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert("Brak uprawnień do aparatu!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    const fetchPeak = async () => {
      try {
        const res = await peaksService.getById(id as string);
        setPeak(res.data.data);
        navigation.setOptions({
          title: res.data.data.name || "Szczyt",
        });
      } catch (error) {
        console.error("Błąd pobierania szczytu:", error);
      }
    };
    if (id) fetchPeak();
  }, [id]);

  if (!peak)
    return <Text className="text-white text-center mt-10">Ładowanie...</Text>;

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
            <View className="bg-white/10 w-full p-5 rounded-2xl justify-center items-center">
              <Text className="text-lg text-white font-bold">
                Informacje o szczycie:
              </Text>
              <View className="flex-row gap-5">
                <Text className="text-white mt-2 ">
                  Wysokość:
                  <Text className="text-yellow-400 font-semibold ">
                    {peak.elevation} m n.p.m
                  </Text>
                </Text>
                <Text className="text-white mt-2">Region: {peak.region}</Text>
              </View>
              <View className="flex-row gap-5">
                <Text className="text-white mt-2 ">
                  Zdobyte:
                  <Text className="text-yellow-400 font-semibold ">nie</Text>
                </Text>
                <Text className="text-white mt-2">Data</Text>
              </View>
            </View>
            <View className="flex-row gap-5 mt-5 w-full justify-center p-2">
              <Pressable
                className={`w-1/2 py-2 rounded-lg ${isMapVisible ? "bg-white/10" : ""}`}
                onPress={() => setIsMapVisible(true)}
              >
                <Text className="text-xl text-center font-semibold text-white ">
                  Mapa
                </Text>
              </Pressable>
              <Pressable
                className={`w-1/2 py-2 rounded-lg ${!isMapVisible ? "bg-white/10" : ""}`}
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
                      peak.longitude && peak.latitude
                        ? [peak.longitude, peak.latitude]
                        : undefined
                    }
                  />
                </View>
              ) : (
                <View className="bg-white/10 p-5 rounded-2xl h-full justify-center items-center">
                  <View className="flex-row gap-4 mt-5">
                    <Pressable
                      className="h-32 w-32 bg-white/30 rounded-full justify-center items-center"
                      onPress={takePhoto}
                    >
                      <FontAwesome6 name="camera" size={30} color="#ffffff" />
                      <Text className="text-white text-center text-sm">
                        Zrób zdjęcie
                      </Text>
                    </Pressable>

                    <Pressable
                      className="h-32 w-32 bg-white/30 rounded-full justify-center items-center"
                      onPress={pickImage}
                    >
                      <FontAwesome6 name="images" size={30} color="#ffffff" />
                      <Text className="text-white text-center text-sm">
                        Wybierz z galerii
                      </Text>
                    </Pressable>
                  </View>
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
