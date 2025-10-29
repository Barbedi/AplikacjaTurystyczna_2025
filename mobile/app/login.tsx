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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { loginUser, getAuthenticatedUser } from "@/src/config/api";
import type { AuthResponse } from "@/src/types";

export default function Login() {
  const router = useRouter();
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const data = await loginUser(email, password);
      console.log("✅ Zalogowano pomyślnie:", data);
      router.replace("/(dashboard)/home");
    } catch (err: any) {
      console.error("Błąd logowania:", err.response?.data || err.message);
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
        <View className="bg-white/20 backdrop-blur-sm  p-6 rounded-2xl w-full max-w-sm ">
          <Text className="text-white text-4xl font-bold text-center mb-8 tracking-wide drop-shadow-md">
            Zaloguj się
          </Text>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#e5e7eb"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            className="w-full mb-4 px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20"
          />

          <TextInput
            placeholder="Hasło"
            placeholderTextColor="#e5e7eb"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="w-full mb-6 px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20"
          />
          <Pressable
            onPress={handleLogin}
            className="w-full bg-blue-600 py-3 rounded-2xl items-center active:bg-blue-700"
          >
            <Text className="text-white text-lg font-semibold">Zaloguj</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
