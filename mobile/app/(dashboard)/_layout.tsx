import { MaterialTopTabs } from "@/src/components/MaterialTopTabs";
import { Ionicons } from "@expo/vector-icons";
import { View, Animated, TouchableOpacity, StyleSheet } from "react-native";
import { useEffect, useRef, ComponentProps } from "react";
import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";

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

const tabsConfig: TabConfig[] = [
  { name: "home", title: "Home", icon: "home", outlineIcon: "home-outline" },
  { name: "menu", title: "Menu", icon: "list", outlineIcon: "list-outline" },
  { name: "profile", title: "Profile", icon: "person", outlineIcon: "person-outline" },
];

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

function CustomTabBar({ state, descriptors, navigation }: MaterialTopTabBarProps) {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Find the icon name from tabsConfig based on route.name
        const tabConfig = tabsConfig.find(t => t.name === route.name);
        // If route is not in config (e.g. index), skip or handle default
        if (!tabConfig) return null;

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
            activeOpacity={1}
          >
             <AnimatedTabBarIcon
                focused={isFocused}
                name={tabConfig.icon}
                outlineName={tabConfig.outlineIcon}
             />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function DashboardLayout() {
  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <MaterialTopTabs
        tabBarPosition="bottom"
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          swipeEnabled: true,
          animationEnabled: true,
        }}
      >
        {tabsConfig.map((tab) => (
          <MaterialTopTabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.title,
            }}
          />
        ))}
      </MaterialTopTabs>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    backgroundColor: "#1a2b5c",
    width: "80%",
    alignSelf: "center",
    bottom: 20,
    elevation: 20,
    zIndex: 100,
    height: 55,
    borderRadius: 35,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  }
});