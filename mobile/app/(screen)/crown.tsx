import { View, Text, ScrollView, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";

const images = {
  kgp: require("../../assets/KGP/IMG_4048.webp"),
  kbs: require("../../assets/KGP/IMG_2341.jpg"),
  kbw: require("../../assets/KGP/IMG_6488.webp"),
};

const CrownScreen = () => {
  useEffect(() => {
    Image.prefetch(Image.resolveAssetSource(images.kgp).uri);
    Image.prefetch(Image.resolveAssetSource(images.kbs).uri);
    Image.prefetch(Image.resolveAssetSource(images.kbw).uri)
  }, []);

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
          <View className="flex-col gap-5">
            <View className="bg-white/10 w-full rounded-2xl overflow-hidden border-l-4 border-yellow-500">
              <View className="w-full h-72">
                <Image
                  source={images.kgp}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                  }}
                >
                  <Text className="text-white text-center text-2xl font-bold">
                    Korona Gór Polski
                  </Text>
                  <Text className="text-white/90 text-center mt-2 text-sm">
                    28 szczytów i 16 pasm górskich, które zapierają dech w
                    piersiach.
                  </Text>
                </View>
              </View>
            </View>

            <View className="bg-white/10 w-full rounded-2xl overflow-hidden border-l-4 border-purple-500">
              <View className="w-full h-72">
                <Image
                  source={images.kbs}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                  }}
                >
                  <Text className="text-white text-center text-2xl font-bold">
                    Korona Beskidu Sądeckiego
                  </Text>
                  <Text className="text-white/90 text-center mt-2 text-sm">
                    Odkryj ukryte szlaki i zachwycające widoki Korony Beskidu
                    Sądeckiego.
                  </Text>
                </View>
              </View>
            </View>
            <View className="bg-white/10 w-full rounded-2xl overflow-hidden border-l-4 border-gray-500 opacity-60">
              <View className="w-full h-72">
                <Image
                  source={images.kbw}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
                <View
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    backgroundColor: "rgba(239, 68, 68, 0.9)",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 12,
                  }}
                >
                  <Text className="text-white text-xs font-bold">NIEDOSTĘPNE</Text>
                </View>
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                  }}
                >
                  <Text className="text-white text-center text-2xl font-bold">
                    Korona Beskidu Wyspowego
                  </Text>
                  <Text className="text-white/90 text-center mt-2 text-sm">
                    Wkrótce dostępne...
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
