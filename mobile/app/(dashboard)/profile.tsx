import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";

export default function ProfileScreen() {
  return (
    <LinearGradient colors={["#5996eb", "#050c28"]} className="flex-1">
      <SafeAreaView className="flex-1">
        <ScrollView
          contentContainerStyle={{ padding: 20, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-col items-center gap-6 lg:flex-row lg:justify-between">
            <View className="flex-col items-center gap-4">
              <View className="w-32 h-32 rounded-full overflow-hidden bg-white/10 items-center justify-center">
                <FontAwesome6 name="circle-user" size={70} color="#ffffffaa" />
              </View>
              <Text className="text-2xl font-bold text-white">
                Użytkownik HikeUp
              </Text>
              <Text className="text-white/70 text-sm">example@email.com</Text>
            </View>
            <View className="flex-row gap-3 mt-4">
              <Pressable className="bg-white/20 px-4 py-2 rounded-lg flex-row items-center gap-2">
                <FontAwesome6 name="gear" size={16} color="white" />
                <Text className="text-white font-semibold">Edytuj profil</Text>
              </Pressable>
            </View>
          </View>
          <View className="mt-10">
            <Text className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2">
              Dane profilu
            </Text>
            <View className="bg-white/5 rounded-xl p-4 mb-4">
              <View className="flex-row items-center mb-2">
                <FontAwesome6 name="user" size={18} color="#ffffffaa" />
                <Text className="text-white/70 ml-2">Imię i nazwisko</Text>
              </View>
              <Text className="text-white">Jan Kowalski</Text>
            </View>
            <View className="bg-white/5 rounded-xl p-4 mb-4">
              <View className="flex-row items-center mb-2">
                <FontAwesome6 name="envelope" size={18} color="#ffffffaa" />
                <Text className="text-white/70 ml-2">Email</Text>
              </View>
              <Text className="text-white">example@email.com</Text>
            </View>
            <View className="bg-white/5 rounded-xl p-4 mb-4">
              <View className="flex-row items-center mb-2">
                <FontAwesome6
                  name="person-hiking"
                  size={18}
                  color="#ffffffaa"
                />
                <Text className="text-white/70 ml-2">Poziom doświadczenia</Text>
              </View>
              <Text className="text-white">Średniozaawansowany</Text>
            </View>
            <View className="bg-white/5 rounded-xl p-4 mb-4">
              <View className="flex-row items-center mb-2">
                <FontAwesome6
                  name="person-running"
                  size={18}
                  color="#ffffffaa"
                />
                <Text className="text-white/70 ml-2">Poziom wysportowania</Text>
              </View>
              <Text className="text-white">Aktywności 3–4 razy w tygodniu</Text>
            </View>
          </View>
          <View className="mt-5 mb-20">
            <Pressable className="bg-red-500 rounded-xl p-4 items-center">
              <Text className="text-white font-semibold">Wyloguj się</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
