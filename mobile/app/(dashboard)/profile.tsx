import { View,Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";





const Profile=()=> {
    return (
        <LinearGradient
      colors={["#5996eb", "#050c28"]}
      className="flex-1"
    >
      <View className="flex-1 items-center justify-center">
        <Text className="text-3xl">Profile Screen</Text>
        </View>
        </LinearGradient>
    );
    }
export default Profile;
    