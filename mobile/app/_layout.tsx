import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const [fontsLoaded] = useFonts(Ionicons.font);

  useEffect(() => {
    if (fontsLoaded) {
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="(dashboard)" />
        <Stack.Screen name="(screen)" />
      </Stack>
    </GestureHandlerRootView>
  );
}
