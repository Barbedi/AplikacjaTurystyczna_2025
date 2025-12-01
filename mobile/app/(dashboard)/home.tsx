import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Image,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { useEffect } from "react";
import { getAuthenticatedUser } from "@/src/config/api";
import useGetUsers from "@/src/hooks/useGetUser";
import { useState } from "react";
import filesService from "@/src/services/file.service";
import TrailsCarousel from "@/src/components/home/TrailsCarousel";
import Discover from "@/src/components/home/Discover";
import WeatherWidgetMobile from "@/src/components/home/Weather";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback } from "react";

const Home = () => {
  const { usersData, getUserByEmail } = useGetUsers();
  const [profileImgUrl, setProfileImgUrl] = useState<string | null>(null);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
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
    }, [getUserByEmail])
  );

  const user = usersData?.[0]?.[0];

  useEffect(() => {
    if (user?.profile_image) {
      const imgUrl = filesService.getImgUrl(user.profile_image);
      setProfileImgUrl(imgUrl);
    } else {
      setProfileImgUrl(null);
    }
  }, [user]);

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
          <View className="flex flex-col gap-5">
            <View className="flex flex-row items-center justify-between">
              <View className="flex flex-row items-center gap-3">
                <Pressable onPress={() => router.push("/(dashboard)/profile")}>
                  {profileImgUrl ? (
                    <Image
                      source={{ uri: profileImgUrl }}
                      className="w-16 h-16 rounded-full border-2 border-white/30"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center border-2 border-white/30">
                      <FontAwesome6
                        name="circle-user"
                        size={40}
                        color="#ffffffaa"
                      />
                    </View>
                  )}
                </Pressable>
                <View className="flex flex-col">
                  <Text className="text-sm text-white/70">Witaj ponownie</Text>
                  <Text className="text-xl text-white font-bold">
                    {user?.name || "Użytkowniku"}
                  </Text>
                </View>
              </View>
              <Pressable onPress={() => router.push("/(screen)/notifications")}>
              <View className="bg-white/20 w-12 h-12 rounded-full items-center justify-center">
                <FontAwesome6 name="bell" size={20} color="#fff" />
              </View>
              </Pressable>
            </View>

            <View className="w-full h-14 rounded-2xl bg-white/20 px-5 flex-row items-center gap-3 ">
              <FontAwesome6 name="magnifying-glass" size={18} color="#ffffff" />
              <Text className="text-white/70 text-base">
                Szukaj tras, szczytów...
              </Text>
            </View>

            <WeatherWidgetMobile />
            <Discover />
            <TrailsCarousel />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Home;
