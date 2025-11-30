import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  Alert,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { useEffect } from "react";
import { getAuthenticatedUser } from "@/src/config/api";
import useGetUsers from "@/src/hooks/useGetUser";
import { useState } from "react";
import filesService from "@/src/services/file.service";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { logoutUser } from "@/src/config/api";
import { Users } from "@/src/types";
import useUpdateUser from "@/src/hooks/useUpdateUser";
import { toast } from "@/src/utils/toast";

const ProfileScreen = () => {
  const router = useRouter();
  const { usersData, loading, getUserByEmail } = useGetUsers();
  const [profileImgUrl, setProfileImgUrl] = useState<string | null>(null);
  const [experience, setExperience] = useState("");
  const [fitness, setFitness] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState<Users | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { updateUser } = useUpdateUser();

  const handleInputChange = (field: keyof Users, value: string) => {
    if (!editedUser) return;
    setEditedUser({ ...editedUser, [field]: value });
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const authData = await getAuthenticatedUser();
        if (authData?.user?.email) {
          await getUserByEmail(authData.user.email);
        }
      } catch (error) {
        console.error("Błąd ładowania użytkownika:", error);
      }
    };

    loadUser();
  }, [getUserByEmail]);

  const user = usersData?.[0]?.[0];

  useEffect(() => {
    if (user) {
      setEditedUser(user);
    }
    if (user?.profile_image) {
      const imgUrl = filesService.getImgUrl(user.profile_image);
      setProfileImgUrl(imgUrl);
    } else {
      setProfileImgUrl(null);
    }
    if (user?.level_of_experience) {
      setExperience(user.level_of_experience);
    }
    if (user?.fitness_level) {
      setFitness(user.fitness_level);
    }
  }, [user]);
  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Wylogowano pomyślnie", "Do zobaczenia!");
      router.replace("/login");
    } catch (err: any) {
      console.error("Błąd wylogowania:", err);

      if (err?.response?.status === 401 || err?.response?.status === 403) {
        toast.info("Twoja sesja wygasła", "Wylogowanie nie powiodło się");
        router.replace("/login");
        return;
      }

      if (err?.message?.toLowerCase().includes("network")) {
        toast.error(
          "Brak połączenia z internetem",
          "Wylogowanie nie powiodło się",
        );
        return;
      }

      toast.error("Nie udało się wylogować", "Spróbuj ponownie później");
    }
  };

  const handleEditMode = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    if (user) {
      setEditedUser(user);
      setExperience(user.level_of_experience || "");
      setFitness(user.fitness_level || "");
    }
  };
  const handleSaveChanges = async () => {
    if (!editedUser || !user?.id) return;

    setIsSaving(true);
    try {
      const updatedUser = {
        ...editedUser,
        level_of_experience: experience,
        fitness_level: fitness,
      };

      const message = await updateUser(user.id, updatedUser);
      if (message) {
        setEditMode(false);
        await getUserByEmail(user.email || "");
        toast.success("Profil został zaktualizowany");
      }
    } catch (error) {
      console.error("Error saving profile changes:", error);
      toast.error("Nie udało się zapisać zmian");
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <LinearGradient colors={["#5996eb", "#050c28"]} className="flex-1">
      <SafeAreaView className="flex-1">
        <ScrollView
          contentContainerStyle={{ padding: 20, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-col items-center gap-6 lg:flex-row lg:justify-between">
            <View className="flex-col items-center gap-2 ">
              {profileImgUrl ? (
                <Image
                  source={{ uri: profileImgUrl }}
                  className="w-28 h-28 rounded-full "
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <View className="w-32 h-32 rounded-full overflow-hidden bg-white/10 items-center justify-center">
                  <FontAwesome6
                    name="circle-user"
                    size={70}
                    color="#ffffffaa"
                  />
                </View>
              )}
              <Text className="text-2xl font-bold text-white">
                {user?.name}
              </Text>
              <Text className="text-white/70 text-sm">{user?.email}</Text>
            </View>
            <View className="flex-row gap-3 ">
              {!editMode ? (
                <Pressable
                  onPress={handleEditMode}
                  className="bg-white/20 px-4 py-2 rounded-lg flex-row items-center gap-2"
                >
                  <FontAwesome6 name="gear" size={16} color="white" />
                  <Text className="text-white font-semibold">
                    Edytuj profil
                  </Text>
                </Pressable>
              ) : (
                <View className="flex-row gap-3">
                  <Pressable
                    onPress={handleSaveChanges}
                    className="bg-white/20 px-4 py-2 rounded-lg flex-row items-center gap-2"
                  >
                    <FontAwesome6 name="check" size={16} color="white" />
                    <Text className="text-white font-semibold">Zapisz</Text>
                  </Pressable>

                  <Pressable
                    onPress={handleCancelEdit}
                    className="bg-white/20 px-4 py-2 rounded-lg flex-row items-center gap-2"
                  >
                    <FontAwesome6 name="xmark" size={16} color="white" />
                    <Text className="text-white font-semibold">Anuluj</Text>
                  </Pressable>
                </View>
              )}
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

              {editMode ? (
                <TextInput
                  value={editedUser?.name || ""}
                  readOnly={!editMode}
                  onChangeText={(text) => handleInputChange("name", text)}
                  className="w-full px-3 py-2 rounded-lg text-base bg-white/10 border border-white/30 text-white placeholder-white focus:outline-none"
                  placeholder="Wpisz imię i nazwisko"
                  placeholderTextColor="#ffffff80"
                />
              ) : (
                <Text className="text-white text-base">{user?.name}</Text>
              )}
            </View>
            <View className="bg-white/5 rounded-xl p-4 mb-4">
              <View className="flex-row items-center mb-2">
                <FontAwesome6 name="envelope" size={18} color="#ffffffaa" />
                <Text className="text-white/70 ml-2">Email</Text>
              </View>
              <TextInput readOnly className="text-white text-base">
                {user?.email}
              </TextInput>
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
              <View className="rounded-xl overflow-hidden">
                <Picker
                  selectedValue={experience}
                  enabled={editMode}
                  onValueChange={(value) => setExperience(value)}
                  style={{ color: "white", fontSize: 16 }}
                  dropdownIconColor="#fff"
                >
                  <Picker.Item
                    label="Wybierz poziom doświadczenia"
                    value=""
                    style={{ fontSize: 14 }}
                  />
                  <Picker.Item
                    label="Początkujący"
                    value="beginner"
                    style={{ fontSize: 14 }}
                  />
                  <Picker.Item
                    label="Średniozaawansowany"
                    value="intermediate"
                    style={{ fontSize: 14 }}
                  />
                  <Picker.Item
                    label="Zaawansowany"
                    value="advanced"
                    style={{ fontSize: 14 }}
                  />
                  <Picker.Item
                    label="Ekspert"
                    value="expert"
                    style={{ fontSize: 14 }}
                  />
                  <Picker.Item
                    label="Profesjonalista"
                    value="pro"
                    style={{ fontSize: 14 }}
                  />
                </Picker>
              </View>
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
              <View className="rounded-xl overflow-hidden">
                <Picker
                  selectedValue={fitness}
                  enabled={editMode}
                  onValueChange={(value) => setFitness(value)}
                  style={{ color: "white", fontSize: 16 }}
                  dropdownIconColor="#fff"
                >
                  <Picker.Item
                    label="Wybierz poziom wysportowania"
                    value=""
                    style={{ fontSize: 14 }}
                  />
                  <Picker.Item
                    label="Brak aktywności"
                    value="beginner"
                    style={{ fontSize: 14 }}
                  />
                  <Picker.Item
                    label="Aktywności 1-2 razy w tygodniu"
                    value="intermediate"
                    style={{ fontSize: 14 }}
                  />
                  <Picker.Item
                    label="Aktywności 3-4 razy w tygodniu"
                    value="advanced"
                    style={{ fontSize: 14 }}
                  />
                  <Picker.Item
                    label="Aktywności 5-6 razy w tygodniu"
                    value="expert"
                    style={{ fontSize: 14 }}
                  />
                  <Picker.Item
                    label="Aktywności codziennie"
                    value="pro"
                    style={{ fontSize: 14 }}
                  />
                </Picker>
              </View>
            </View>
          </View>
          <View className="mt-5 mb-20">
            <Pressable
              onPress={handleLogout}
              className="bg-red-500 rounded-xl p-4 items-center"
            >
              <Text className="text-white font-semibold">Wyloguj się</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ProfileScreen;
