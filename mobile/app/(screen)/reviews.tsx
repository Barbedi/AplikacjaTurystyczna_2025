import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

const reviewsScreen = () => {
  return (
    <LinearGradient colors={["#5996eb", "#050c28"]} className="flex-1">
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-1 items-center justify-center">
          <Text>Review Screen</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default reviewsScreen;
