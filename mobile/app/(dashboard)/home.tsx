import { View,Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";


const Home=()=> {
    return (
        <LinearGradient
        colors={["#5996eb", "#050c28"]}
        className="flex-1"
      >
        <View className="flex-1 items-center justify-center">
        <Text>Home Screen</Text>
        </View>
        </LinearGradient>
    );
    }

export default Home;
