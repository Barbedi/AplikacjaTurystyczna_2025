import { View, Text, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";

const PeaksScreen = () => {
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
          <View className="flex-col gap-4">
            <View className="w-full bg-white/10 rounded-2xl p-5 border-l-4 border-yellow-500">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center gap-3">
                  <View className="bg-yellow-500/20 w-12 h-12 rounded-full items-center justify-center">
                    <FontAwesome6 name="crown" size={24} color="#eab308" />
                  </View>
                  <View>
                    <Text className="text-2xl font-bold text-white">Rysy</Text>
                    <Text className="text-sm text-white/70">2503 m n.p.m.</Text>
                  </View>
                </View>
                <View className="bg-green-500/20 px-3 py-1 rounded-full">
                  <Text className="text-green-400 font-semibold text-xs">ZDOBYTY</Text>
                </View>
              </View>
              
              <View className="flex-row items-center gap-2 mt-2">
                <FontAwesome6 name="calendar" size={14} color="#ffffff90" />
                <Text className="text-white/70 text-sm">środa, 6 sierpień 2025</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};
export default PeaksScreen;
