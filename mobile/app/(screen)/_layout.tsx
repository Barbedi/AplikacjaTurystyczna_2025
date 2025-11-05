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
        name="stats" 
        options={{ 
          title: "Statystyki",
          headerTitleAlign: "center"
        }}
      />
      <Stack.Screen 
        name="crown" 
        options={{ 
          title: "Korona Gór",
          headerTitleAlign: "center"
        }}
      />
      <Stack.Screen 
        name="favourites" 
        options={{ 
          title: "Ulubione",
          headerTitleAlign: "center"
        }}
      />
      <Stack.Screen 
        name="map" 
        options={{ 
          title: "Mapa",
          headerTitleAlign: "center"
        }}
      />
      <Stack.Screen 
        name="myRoutes" 
        options={{ 
          title: "Moje Trasy",
          headerTitleAlign: "center"
        }}
      />
      <Stack.Screen 
        name="peaks" 
        options={{ 
          title: "Szczyty",
          headerTitleAlign: "center"
        }}
      />
      <Stack.Screen 
        name="record" 
        options={{ 
          title: "Nagraj Trasę",
          headerTitleAlign: "center"
        }}
      />
      <Stack.Screen 
        name="reviews" 
        options={{ 
          title: "Recenzje",
          headerTitleAlign: "center"
        }}
      />
    </Stack>
    
    
  );
}
