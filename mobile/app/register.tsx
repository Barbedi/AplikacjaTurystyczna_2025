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
import { useRouter } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import rejestracjaService from "@/src/services/rejestracja.service";

const Register = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  const submitHandler = async () => {
    try {
      if (
        !name.trim() ||
        !email.trim() ||
        !password.trim() ||
        !confirmPassword.trim()
      ) {
        Alert.alert("Błąd", "Uzupełnij wszystkie pola");
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert("Błąd", "Hasła nie są identyczne");
        return;
      }

      const response = await rejestracjaService.create({
        name,
        email,
        password,
      });

      if (response.status === 201) {
        console.log("✅ Zarejestrowano pomyślnie:", response.data);
        Alert.alert("Sukces", "Konto utworzono pomyślnie!");
        router.replace("/login");
      }
    } catch (error: any) {
      console.error("Błąd rejestracji:", error);

      if (error?.response?.status === 409) {
        Alert.alert(
          "Uwaga",
          "Użytkownik o podanym adresie e-mail już istnieje",
        );
        return;
      }

      Alert.alert(
        "Błąd",
        "Nie udało się zarejestrować. Spróbuj ponownie później.",
      );
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
          <Text className="text-7xl text-white font-bold">HikeUp</Text>
          <Text className="text-white/70 text-md tracking-wide">
            Twoje góry. Twoja przygoda. Twój start.
          </Text>
        </View>
        <View className="bg-white/15 backdrop-blur-lg p-8 rounded-3xl w-full max-w-sm border border-white/20">
          <Text className="text-white text-3xl font-bold text-center mb-6 tracking-wide">
            Zarejestruj się
          </Text>
          <View className="mb-4 flex-row items-center bg-white/10 rounded-2xl border border-white/20 px-4 py-3">
            <FontAwesome6 name="user" size={18} color="#ffffff80" />
            <TextInput
              placeholder="Nazwa użytkownika"
              placeholderTextColor="#ffffff80"
              value={name}
              onChangeText={setName}
              className="flex-1 ml-3 text-white text-base"
            />
          </View>
          <View className="mb-4 flex-row items-center bg-white/10 rounded-2xl border border-white/20 px-4 py-3">
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
          <View className="mb-4 flex-row items-center bg-white/10 rounded-2xl border border-white/20 px-4 py-3">
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
          <View className="mb-6 flex-row items-center bg-white/10 rounded-2xl border border-white/20 px-4 py-3">
            <FontAwesome6 name="lock" size={18} color="#ffffff80" />
            <TextInput
              placeholder="Powtórz hasło"
              placeholderTextColor="#ffffff80"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              className="flex-1 ml-3 text-white text-base"
            />
          </View>
          <Pressable
            onPress={submitHandler}
            className="w-full py-3 rounded-2xl items-center"
            style={({ pressed }) => ({
              backgroundColor: pressed ? "#1e40af" : "#2563eb",
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <View className="flex-row items-center gap-2">
              <Text className="text-white text-lg font-bold">Zarejestruj</Text>
              <FontAwesome6 name="arrow-right" size={18} color="#ffffff" />
            </View>
          </Pressable>
        </View>
        <View className="mt-6 flex-row items-center">
          <Text className="text-white/60 text-base">Masz konto? </Text>
          <Pressable onPress={() => router.replace("/login")}>
            <Text className="text-white font-bold text-base">Zaloguj się</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default Register;
