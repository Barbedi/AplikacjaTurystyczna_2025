import { Stack } from "expo-router";

export default function ScreenLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "600",
          color: "#fff",
        },
        headerStyle: {
          backgroundColor: "#5996eb",
        },
      }}
    >
      <Stack.Screen
        name="crown"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="proposed"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="myRoutes"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="activity"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: "Powiadomienia",
          headerTitleAlign: "center",
        }}
      />

      <Stack.Screen
        name="stats"
        options={{
          title: "Statystyki",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="record-summary"
        options={{
          title: "Podsumowanie Trasy",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="favourites"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="map"
        options={{
          title: "Mapa",
          headerTitleAlign: "center",
        }}
      />

      <Stack.Screen
        name="peaks"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="record"
        options={{
          title: "Nagraj Trasę",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="reviews"
        options={{
          title: "Recenzje",
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}
