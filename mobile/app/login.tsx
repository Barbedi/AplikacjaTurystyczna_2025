import "../global.css";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { loginUser, getAuthenticatedUser } from "@/src/config/api";
import type { AuthResponse } from "@/src/types";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { toast } from "@/src/utils/toast";

export default function Login() {
  const router = useRouter();
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const handleLogin = async () => {
  try {
    const data = await loginUser(email, password);
    toast.success("Zalogowano pomyślnie", "Witaj w HikeUp!");
    router.replace("/(dashboard)/home");

  } catch (err: any) {
    console.log("Login error:", err);
    if (err?.response?.status === 401) {
      toast.info("Nieprawidłowy email lub hasło", "Spróbuj ponownie");
      return;
    }

    if (err?.message === "Network Error") {
      toast.error("Brak połączenia z internetem", "Sprawdź sieć");
      return;
    }
    toast.error("Wystąpił nieoczekiwany błąd", "Spróbuj ponownie później");
  }
};


  return (
    <LinearGradient
      colors={["#5996eb", "#1a2b5c", "#050c28"]}
      className="flex-1"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center items-center px-6"
      >
        <View className="mb-8 items-center">
          <View className=" items-center justify-center mb-3 ">
            <Text className="text-7xl text-white font-bold">HikeUp</Text>
          </View>
          <Text className="text-white/70 text-md  tracking-wide">
            Twoje góry. Twoja przygoda. Twój start.
          </Text>
        </View>

        <View className="bg-white/15 backdrop-blur-lg p-8 rounded-3xl w-full max-w-sm border border-white/20">
          <Text className="text-white text-3xl font-bold text-center mb-6 tracking-wide">
            Zaloguj się
          </Text>
          <View className="mb-4">
            <View className="flex-row items-center bg-white/10 rounded-2xl border border-white/20 px-4 py-3">
              <FontAwesome6 name="envelope" size={18} color="#ffffff80" />
              <TextInput
                placeholder="Email"
                placeholderTextColor="#ffffff80"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                className="flex-1 ml-3 text-white text-base"
              />
            </View>
          </View>
          <View className="mb-6">
            <View className="flex-row items-center bg-white/10 rounded-2xl border border-white/20 px-4 py-3">
              <FontAwesome6 name="lock" size={18} color="#ffffff80" />
              <TextInput
                placeholder="Hasło"
                placeholderTextColor="#ffffff80"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                className="flex-1 ml-3 text-white text-base"
              />
            </View>
          </View>

          <Pressable
            onPress={handleLogin}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 py-3 rounded-2xl items-center active:opacity-80 "
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
              backgroundColor: pressed ? "#1e40af" : "#2563eb",
            })}
          >
            <View className="flex-row items-center gap-2">
              <Text className="text-white text-lg font-bold">Zaloguj się</Text>
              <FontAwesome6 name="arrow-right" size={18} color="#ffffff" />
            </View>
          </Pressable>
          <Pressable className="mt-4">
            <Text className="text-white/60 text-center text-sm">
              Zapomniałeś hasła?
            </Text>
          </Pressable>
        </View>
        <View className="mt-6 flex-row items-center">
          <Text className="text-white/60 text-base">Nie masz konta? </Text>
          <Pressable onPress={() => router.replace("/register")}>
            <Text className="text-white font-bold text-base">
              Zarejestruj się
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
