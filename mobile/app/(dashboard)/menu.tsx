import { View, Text, Image, Pressable, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function Menu() {
  const router = useRouter();

  const modules = [
    {
      title: "Mapa tras",
      route: "/(dashboard)/map",
    },
    {
      title: "Statystyki",
      route: "/(dashboard)/stats",
    },
    {
      title: "Społeczność",
      route: "/(dashboard)/community",
    },
    {
      title: "Ulubione szlaki",
      route: "/(dashboard)/favourites",
    },
  ];

  return (
    <LinearGradient colors={["#050c28", "#1e3a8a"]} className="flex-1">
      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-white text-2xl font-bold mb-4">Menu główne</Text>

        <View className="flex flex-row flex-wrap justify-between">
          {modules.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => router.push(item.route)}
              className="w-[48%] mb-4 rounded-2xl overflow-hidden"
            >
              <View className="relative">
                
                <LinearGradient
                  colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]}
                  className="absolute inset-0 justify-end p-3"
                >
                  <Text className="text-white text-lg font-semibold">
                    {item.title}
                  </Text>
                </LinearGradient>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
