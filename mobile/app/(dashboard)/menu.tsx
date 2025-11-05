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
      color: "#8b5cf6",
      bgColor: "bg-purple-500/20"
    },
    { 
      title: "Nagraj trasę", 
      route: "/(screen)/record", 
      icon: "video",
      color: "#ef4444",
      bgColor: "bg-red-500/20"
    },
    {
      title: "Moje trasy",
      route: "/(screen)/myRoutes",
      icon: "location-pin-lock",
      color: "#10b981",
      bgColor: "bg-green-500/20"
    },
    { 
      title: "Ulubione trasy", 
      route: "/(screen)/favourites", 
      icon: "heart",
      color: "#ec4899",
      bgColor: "bg-pink-500/20"
    },
    {
      title: "Moje szczyty",
      route: "/(screen)/peaks",
      icon: "map-location-dot",
      color: "#f59e0b",
      bgColor: "bg-amber-500/20"
    },
    { 
      title: "Korona Gór", 
      route: "/(screen)/crown", 
      icon: "mountain-sun",
      color: "#8b5cf6",
      bgColor: "bg-purple-500/20"
    },
    { 
      title: "Statystyki", 
      route: "/(screen)/stats", 
      icon: "chart-simple",
      color: "#06b6d4",
      bgColor: "bg-cyan-500/20"
    },
    { 
      title: "Moje opinie", 
      route: "/(screen)/reviews", 
      icon: "comment",
      color: "#eab308",
      bgColor: "bg-yellow-500/20"
    },
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
          
          <View className="flex-col gap-3">
            {modules.map((item, index) => (
              <Pressable
                key={index}
                onPress={() => router.push(item.route)}
                className="bg-white/10 rounded-2xl p-4 flex-row items-center gap-4 active:bg-white/20"
              >
                <View className={`${item.bgColor} w-14 h-14 rounded-full items-center justify-center`}>
                  <FontAwesome6 name={item.icon} size={24} color={item.color} />
                </View>
                <Text className="text-white text-lg font-semibold flex-1">
                  {item.title}
                </Text>
                <FontAwesome6 name="chevron-right" size={16} color="#ffffff60" />
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
