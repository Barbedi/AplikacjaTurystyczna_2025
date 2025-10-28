import { View, Text, Pressable, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";

export default function Menu() {
  const router = useRouter();

  const modules = [
    { title: "Zaplanuj trasy", route: "/(screen)/map", icon: "route" },
    { title: "Nagraj trasę", route: "/(screen)/record", icon: "video" },
    { title: "Moje trasy", route: "/(screen)/myRoutes", icon: "location-pin-lock" },
    { title: "Ulubione trasy", route: "/(screen)/favourites", icon: "heart" },
    { title: "Moje szczyty", route: "/(screen)/peaks", icon: "map-location-dot" },
    { title: "Korona Gór", route: "/(screen)/crown", icon: "mountain-sun" },
    { title: "Statystyki", route: "/(screen)/stats", icon: "chart-simple" },
    { title: "Moje opinie", route: "/(screen)/reviews", icon: "comment" },
  ];

  return (
    <LinearGradient colors={["#5996eb", "#050c28"]} className="flex-1">
      <SafeAreaView className="flex-1">
        <ScrollView
          contentContainerStyle={{
            padding: 20,
            flexGrow: 1, 
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row flex-wrap justify-between">
            {modules.map((item, index) => (
              <Pressable
                key={index}
                onPress={() => router.push(item.route)}
                className="bg-white/20 backdrop-blur-sm p-9 rounded-2xl w-[48%] aspect-square mb-4 items-center justify-center"
              >
                <View className="flex flex-col items-center justify-center gap-4">
                  <FontAwesome6 name={item.icon} size={24} color="#c084fc" />
                  <Text className="text-white text-base text-center font-semibold">
                    {item.title}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
