import { View, Text, ScrollView, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import React from "react";

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
  const progress = useSharedValue<number>(0);
  const modules = [
    { title: "Tatry" },
    { title: "Beskid Sądecki" },
    { title: "Beskid Wyspowy" },
  ];

  return (
    <LinearGradient colors={["#5996eb", "#050c28"]} className="flex-1">
      <SafeAreaView className="flex-1">
        <ScrollView
          contentContainerStyle={{ padding: 20, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex flex-col">
            {/* Nagłówek */}
            <View className="flex flex-row items-center gap-3">
              <View className="w-19 h-19 rounded-full overflow-hidden bg-white/30 items-center justify-center">
                <FontAwesome6 name="circle-user" size={40} color="#ffffffaa" />
              </View>
              <View className="flex flex-col">
                <Text className="text-md text-white/80">Witaj Jan</Text>
                <Text className="text-lg text-white font-semibold">
                  Miło Cię widzieć!
                </Text>
              </View>
            </View>

            {/* Regiony */}
            <View className="mt-7 bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
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
            <View className="mt-4 p-4">
              <Text className="text-xl mx-2 font-semibold text-white mb-3">
                Proponowane trasy
              </Text>
              <View className="flex justify-center items-center">

              <Carousel
                width={width * 0.6}
                data={defaultDataWith6Colors}
                loop
                autoPlay
                scrollAnimationDuration={1000}
                renderItem={({ item }) => (
                  <View
                    className="rounded-2xl items-center justify-center p-5 h-96 bg-white/20"
                    
                  >
                    <Text className="text-white text-lg font-semibold">
                      {item}
                    </Text>
                  </View>
                )}
              />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Home;
