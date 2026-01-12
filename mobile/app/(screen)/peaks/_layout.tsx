import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

export default function CrownLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "#5996eb" },
        headerTintColor: "#fff",
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Moje Szczyty",
          headerLeft: () => (
            <Pressable onPress={() => router.back()} className="ml-2">
              <FontAwesome6 name="arrow-left" size={20} color="#fff" />
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}
