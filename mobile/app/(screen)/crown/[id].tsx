import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { View, Text, Pressable, ScrollView, Image, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import peaksService from "@/src/services/peaks.service";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6";
import { Peaks, UserPeak } from "@/src/types";
import MapInfo from "@/src/components/map/mapinfo";
import * as ImagePicker from "expo-image-picker";
import userpeaksService from "@/src/services/userpeaks.service";
import { getAuthenticatedUser } from "@/src/config/api";
import useGetUsers from "@/src/hooks/useGetUser";
import filesService from "@/src/services/file.service";
import { formatDate2 } from "@/src/utils/format";

const PeakDetails = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [peak, setPeak] = useState<Peaks>();
  const [isMapVisible, setIsMapVisible] = useState(true);
  const [image, setImage] = useState<string | null>(null);
  const [userPeak, setUserPeak] = useState<UserPeak>();
  const { getUserByEmail, usersData, loading: userLoading } = useGetUsers();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Brak uprawnień", "Aplikacja potrzebuje dostępu do aparatu.", [
        { text: "OK" },
      ]);
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
          const res = await userpeaksService.getUserPeakById(currentUser.id, Number(id));
          setUserPeak(res.data.data);
        } catch (error) {
          console.log("Brak zdobycia użytkownika.");
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
                  <Text className="text-white/60 text-xs uppercase">Wysokość</Text>
                  <Text className="text-white text-lg font-bold">{peak?.elevation} m</Text>
                </View>
                <View className="w-[48%] bg-white/10 p-4 rounded-2xl items-center border border-white/5">
                  <FontAwesome6 name="map-location-dot" size={20} color="#c084fc" />
                  <Text className="text-white/60 text-xs uppercase">Region</Text>
                  <Text className="text-white text-lg font-bold">{peak?.region}</Text>
                </View> 
                <View className="w-[48%] bg-white/10 p-4 rounded-2xl items-center border border-white/5">
                  <FontAwesome6 name="trophy" size={20} color="#facc15" />
                  <Text className="text-white/60 text-xs uppercase">Status</Text>
                  <Text className="text-white text-lg font-bold">
                    {userPeak?.verified ? "Zweryfikowany" : "Niezweryfikowany"}
                  </Text>
                </View>
                <View className="w-[48%] bg-white/10 p-4 rounded-2xl items-center border border-white/5">
                  <FontAwesome6 name="calendar" size={20} color="#4ade80" />
                  <Text className="text-white/60 text-xs uppercase">Odległość:</Text>
                  <Text className="text-white text-lg font-bold">
                    Brak
                  </Text>
                </View>
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
          peak?.longitude && peak?.latitude
            ? [peak.longitude, peak.latitude]
            : undefined
        }
      />
    </View>
  ) : (
    <View className="bg-white/10 p-2 rounded-2xl h-full justify-center items-center">

      {/* --- JEŚLI UŻYTKOWNIK MA ZDJĘCIE --- */}
      {userPeak?.photo_url ? (
        <View className="w-full h-full rounded-2xl overflow-hidden border border-white/30 shadow-2xl">
          <Image
            source={{ uri: filesService.getPeakImgUrl(userPeak.photo_url) }}
            className="w-full h-full"
            resizeMode="cover"
          />

          {/* Gradient + nazwa + data */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.85)"]}
            className="absolute bottom-0 left-0 right-0 pt-12 pb-4 px-4"
          >
            <View className="items-center gap-1">
              <Text className="text-white text-2xl font-bold tracking-wide">
                {peak?.name || ""}
              </Text>

              <View className="flex-row items-center gap-2 mt-1">
                <FontAwesome6 name="calendar-check" size={14} color="#a1a1aa" />
                <Text className="text-zinc-400 text-sm font-medium">
                  {formatDate2(userPeak?.visited_at)}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      ) : (
        /* --- JEŚLI UŻYTKOWNIK NIE MA ZDJĘCIA --- */
        <View className="gap-6 mt-5 items-center">
          {/* Przyciski foto */}
          <View className="flex-row gap-6">
            <Pressable
              className="h-32 w-32 bg-white/20 rounded-2xl justify-center items-center border border-white/10"
              onPress={takePhoto}
            >
              <FontAwesome6 name="camera" size={30} color="#ffffff" />
              <Text className="text-white text-center text-sm mt-2">
                Zrób zdjęcie
              </Text>
            </Pressable>

            <Pressable
              className="h-32 w-32 bg-white/20 rounded-2xl justify-center items-center border border-white/10"
              onPress={pickImage}
            >
              <FontAwesome6 name="images" size={30} color="#ffffff" />
              <Text className="text-white text-center text-sm mt-2">
                Wybierz z galerii
              </Text>
            </Pressable>
          </View>

          {/* INFO O WERYFIKACJI */}
          <View className="bg-white/10 px-4 py-4 rounded-2xl border border-white/20 w-[85%]">
            <View className="flex-row items-start gap-3">
              <FontAwesome6 name="circle-info" size={20} color="#60a5fa" />
              <View className="flex-1">
                <Text className="text-white font-semibold text-sm">
                  Weryfikacja zdjęcia niedostępna w aplikacji
                </Text>
                <Text className="text-white/70 text-xs mt-1 leading-tight">
                  Aby dodać zweryfikowane zdjęcie (z danymi GPS) i potwierdzić
                  zdobycie szczytu, skorzystaj z wersji przeglądarkowej HikeUp.
                </Text>
              </View>
            </View>
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
