import { View, Text, ScrollView,Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

const CrownScreen = () => {
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
          <View className="flex-1 flex-col items-center justify-center gap-5">
            <View className="bg-white/10 w-full rounded-2xl overflow-hidden border border-white/20">
              <View className="w-full h-96 relative">
                <Image
                  className="w-full h-full"
                  source={require("../../assets/KGP/IMG_4048.webp")}
                  resizeMode="cover"
                />
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                  }}
                >
                  <Text className="text-white text-center text-xl font-bold">
                    Korona Gór Polski
                  </Text>
                  <Text className="text-white/90 text-center mt-2 text-sm">
                    28 szczytów i 16 pasm górskich, które zapierają dech w
                    piersiach.
                  </Text>
                </View>
              </View>
            </View>

            <View className="bg-white/10 w-full rounded-2xl overflow-hidden border border-white/20">
              <View className="w-full h-96 relative">
                <Image
                  className="w-full h-full"
                  source={require("../../assets/KGP/IMG_2341.jpg")}
                  resizeMode="cover"
                />
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                  }}
                >
                  <Text className="text-white text-center text-xl font-bold">
                    Korona Beskidu Sądeckiego
                  </Text>
                  <Text className="text-white/90 text-center mt-2 text-sm">
                    Odkryj ukryte szlaki i zachwycające widoki Korony Beskidu
                    Sądeckiego.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};
export default CrownScreen;
