import { View, Text, ScrollView, Dimensions, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import React from "react";
import { useEffect } from "react";
import { getAuthenticatedUser } from "@/src/config/api";
import useGetUsers from "@/src/hooks/useGetUser";
import { useState } from "react";
import filesService from "@/src/services/file.service";
import TrailsCarousel from "@/src/components/home/TrailsCarousel";

const { width } = Dimensions.get("window");

const defaultDataWith6Colors = [
  "#B0604D",
  "#899F9C",
  "#B3C680",
  "#5C6265",
  "#F5D399",
  "#F1F1F1",
];
const Home = () => {
  const { usersData, loading, getUserByEmail } = useGetUsers();
  const [profileImgUrl, setProfileImgUrl] = useState<string | null>(null);

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

  const user = usersData?.[0]?.[0];

  useEffect(() => {
    if (user?.profile_image) {
      const imgUrl = filesService.getImgUrl(user.profile_image);
      setProfileImgUrl(imgUrl);
    } else {
      setProfileImgUrl(null);
    }
  }, [user]);

  const modules = [
    { title: "Tatry" },
    { title: "Beskid Sądecki" },
    { title: "Beskid Wyspowy" },
  ];

  return (
    <LinearGradient colors={["#5996eb", "#050c28"]} className="flex-1">
      <SafeAreaView className="flex-1">
        <ScrollView
          contentContainerStyle={{
            padding: 20,
            flexGrow: 1,
            paddingBottom: 60,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex flex-col">
            <View className="flex flex-row items-center gap-3">
              {profileImgUrl ? (
                <Image
                  source={{ uri: profileImgUrl }}
                  className="w-14 h-14 rounded-full"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <View className="w-14 h-14 rounded-full overflow-hidden bg-white/30 items-center justify-center">
                  <FontAwesome6
                    name="circle-user"
                    size={40}
                    color="#ffffffaa"
                  />
                </View>
              )}
              <View className="flex flex-col">
                <Text className="text-md text-white/80">
                  Witaj {user?.name}
                </Text>
                <Text className="text-lg text-white font-semibold">
                  Miło Cię widzieć!
                </Text>
              </View>
            </View>
            <View className="w-full mt-7 h-12 rounded-full bg-white/30 px-5 flex-row items-center">
              <FontAwesome6 name="magnifying-glass" size={18} color="#fff" />
              <Text className="text-white/80 text-base ml-3">Wyszukaj...</Text>
            </View>
            <View className="w-full mt-2  rounded-2xl p-4">
              <Text className="text-xl font-semibold text-white  mx-2">
                Aktualna pogoda w Twojej lokalizacji
              </Text>

              <View className="flex flex-row items-center">
                <View className="w-20 h-20 rounded-full  items-center justify-center">
                  <FontAwesome6 name="sun" size={48} color="#FFD700" />
                </View>
                <View className="ml-7 justify-center">
                  <Text className="text-white text-4xl font-bold">
                    22&#8451;
                  </Text>
                  <Text className="text-white/80 text-lg font-medium">
                    Słonecznie
                  </Text>
                </View>
              </View>
            </View>
            <View className="mt-5 bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
              <View className="mb-2 flex flex-col">
                <Text className="text-xl mx-2 font-semibold text-white">
                  Odkryj trasy w ...
                </Text>
                <View className="flex flex-row mt-3 justify-center items-center">
                  {modules.map((item, index) => (
                    <View key={index} className="mx-3">
                      <View className="flex flex-col items-center">
                        <View className="w-28 aspect-square rounded-xl bg-black/40 items-center justify-center">
                          <Text className="text-white">zdjęcie</Text>
                        </View>
                        <View className="mt-2">
                          <Text className="text-white font-medium text-center">
                            {item.title}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
              <TrailsCarousel />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Home;
