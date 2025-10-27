import { Tabs } from "expo-router";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { View, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DashboardLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#c084fc",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarShowLabel: true,
        tabBarBackground: () => (
          <View
            style={{
              flex: 1,
              borderRadius: 25,
              overflow: "hidden",
              marginHorizontal: 20,
              shadowColor: "#000",
              shadowOpacity: 0.25,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 3 },
              elevation: 6,
            }}
          >
            <BlurView
              intensity={80}
              style={{
                flex: 1,
                backgroundColor: Platform.OS === "ios" 
                  ? "rgba(255, 255, 255, 0.1)" 
                  : "rgba(30, 30, 30, 0.95)",
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.2)",
              }}
            />
          </View>
        ),

        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          bottom: insets.bottom +5,
          left: 0,
          right: 0,
          paddingBottom: 10,
        },

        tabBarItemStyle: {
          paddingVertical: 8,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
            title: "Home",
            tabBarLabel: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          tabBarLabel: "Menu",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "list" : "list-outline"}
              size={28}
              color={color}
            />

          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={28}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}