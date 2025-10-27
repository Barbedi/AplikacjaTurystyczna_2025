import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Platform } from "react-native";

export default function ScreenLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true, 
        headerTintColor: "#c084fc", 
        headerTitleStyle: {
          fontWeight: "500",
          color: "#c084fc",
        },
        headerTransparent: true, 
        
      }}
    />
  );
}
