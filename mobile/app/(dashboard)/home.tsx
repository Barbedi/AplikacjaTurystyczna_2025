import { View, Text, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";

const Home = () => {
  return (
    <LinearGradient colors={["#5996eb", "#050c28"]} className="flex-1">
      <SafeAreaView className="flex-1">
        <ScrollView
          contentContainerStyle={{ padding: 20, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex flex-col ">
            <View className="flex flex-row items-center gap-3">
              <View className="w-19 h-19 rounded-full overflow-hidden bg-white/30 items-center justify-center">
                <FontAwesome6 name="circle-user" size={40} color="#ffffffaa" />
              </View>
              <View className="flex flex-col">
                <Text className="text-sm">Witaj Jan</Text>
                <Text className="text-md ">Miło Cię widzieć!</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Home;
