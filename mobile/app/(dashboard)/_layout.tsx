import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useRef, ComponentProps } from "react";

type IoniconsName = ComponentProps<typeof Ionicons>['name'];

// --- Typy i Interfejsy ---
interface AnimatedTabBarIconProps {
  focused: boolean;
  name: IoniconsName;
  outlineName: IoniconsName;
}

interface TabConfig {
  name: string;
  title: string;
  icon: IoniconsName;
  outlineIcon: IoniconsName;
}

// --- Konfiguracja ---
const tabsConfig: TabConfig[] = [
  { name: "home", title: "Home", icon: "home", outlineIcon: "home-outline" },
  { name: "menu", title: "Menu", icon: "list", outlineIcon: "list-outline" },
  { name: "profile", title: "Profile", icon: "person", outlineIcon: "person-outline" },
];

// --- Komponent Ikony ---
function AnimatedTabBarIcon({ focused, name, outlineName }: AnimatedTabBarIconProps) {
  const scaleAnim = useRef(new Animated.Value(focused ? 1 : 0.9)).current;
  const fadeAnim = useRef(new Animated.Value(focused ? 1 : 0.6)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: focused ? 1 : 0.9, useNativeDriver: true, tension: 80, friction: 7 }),
      Animated.timing(fadeAnim, { toValue: focused ? 1 : 0.6, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [focused]);

  const handlePressIn = () => {
    Animated.spring(pressAnim, { toValue: 0.85, useNativeDriver: true, speed: 20, bounciness: 2 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 6 }).start();
  };

  return (
    <Animated.View
      style={{
        backgroundColor: focused ? "#ffffff" : "transparent",
        width: 45,
        height: 45,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        transform: [{ scale: scaleAnim }, { scale: pressAnim }],
        opacity: fadeAnim,
      }}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
    >
      <Ionicons name={focused ? name : outlineName} size={24} color={focused ? "#1a2b5c" : "#ffffff"} />
    </Animated.View>
  );
}

// --- Główny Layout ---
export default function DashboardLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "#1a2b5c90",
          width: "80%",
          marginHorizontal: "10.5%",
          bottom: 20,
          borderTopWidth: 0,
          elevation: 15,
          height: 55,
          borderRadius: 35,
          shadowColor: "#000",
          shadowOpacity: 0.3,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 5 },
          paddingBottom: 0,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.1)",
          margin:0,
          padding:0,
        },
        tabBarItemStyle: {
          paddingVertical: 10,
          height: 55,
          margin:0,
          padding:0,
          

        },
      }}
    >
      {tabsConfig.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused }) => (
              <AnimatedTabBarIcon focused={focused} name={tab.icon} outlineName={tab.outlineIcon} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}