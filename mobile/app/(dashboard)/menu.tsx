import { View, Text, Pressable, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";

export default function Menu() {
  const router = useRouter();

  const modules = [
    {
      title: "Zaplanuj trasy",
      route: "/(screen)/map",
      icon: "route",
      color: "#8B5CF6",
      bgColor: "bg-purple-500/20",
      borderColor: "border-purple-500",
    },
    {
      title: "Nagraj trasę",
      route: "/(screen)/record",
      icon: "video",
      color: "#EF4444",
      bgColor: "bg-red-500/20",
      borderColor: "border-red-500",
    },
    {
      title: "Moje trasy",
      route: "/(screen)/myRoutes",
      icon: "location-pin-lock",
      color: "#10B981",
      bgColor: "bg-green-500/20",
      borderColor: "border-green-500",
    },
    {
      title: "Propozycje tras",
      route: "/(screen)/proposed",
      icon: "person-hiking",
      color: "#EAB308",
      bgColor: "bg-yellow-400/20",
      borderColor: "border-yellow-400",
    },
    {
      title: "Ulubione trasy",
      route: "/(screen)/favourites",
      icon: "heart",
      color: "#EC4899",
      bgColor: "bg-pink-500/20",
      borderColor: "border-pink-500",
    },
    {
      title: "Moje szczyty",
      route: "/(screen)/peaks",
      icon: "map-location-dot",
      color: "#F97316",
      bgColor: "bg-orange-500/20",
      borderColor: "border-orange-500",
    },
    {
      title: "Korona Gór",
      route: "/(screen)/crown",
      icon: "mountain-sun",
      color: "#6366F1",
      bgColor: "bg-indigo-500/20",
      borderColor: "border-indigo-500",
    },
    {
      title: "Statystyki",
      route: "/(screen)/stats",
      icon: "chart-simple",
      color: "#06B6D4",
      bgColor: "bg-cyan-500/20",
      borderColor: "border-cyan-500",
    },
    {
      title: "Moje opinie",
      route: "/(screen)/reviews",
      icon: "comment",
      color: "#A3E635",
      bgColor: "bg-lime-400/20",
      borderColor: "border-lime-400",
    },
  ];

  return (
    <LinearGradient colors={["#5996eb", "#050c28"]} className="flex-1">
      <SafeAreaView className="flex-1">
        <ScrollView
          contentContainerStyle={{
            padding: 20,
            paddingBottom: 100,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-col gap-3">
            {modules.map((item, index) => (
              <Pressable
                key={index}
                onPress={() => router.push(item.route)}
                className={`bg-white/10 rounded-2xl p-4 flex-row items-center gap-4 active:bg-white/20  border-l-4 ${item.borderColor}`}
              >
                <View
                  className={`${item.bgColor} w-14 h-14 rounded-full items-center justify-center `}
                >
                  <FontAwesome6 name={item.icon} size={24} color={item.color} />
                </View>
                <Text className="text-white text-lg font-semibold flex-1">
                  {item.title}
                </Text>
                <FontAwesome6
                  name="chevron-right"
                  size={16}
                  color="#ffffff60"
                />
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
