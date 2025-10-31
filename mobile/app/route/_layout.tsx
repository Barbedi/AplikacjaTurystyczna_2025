import { Stack } from "expo-router";

export default function RouteLayout() {
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
