import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { FontAwesome6 } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

import peaksService from "@/src/services/peaks.service";
import userpeaksService from "@/src/services/userpeaks.service";
import { Peaks } from "@/src/types";
import { getAuthenticatedUser } from "@/src/config/api";
import useGetUsers from "@/src/hooks/useGetUser";
import { toast } from "@/src/utils/toast";

interface PeaksBottomSheetProps {
  onPeakAdded?: () => void;
}

const PeaksBottomSheet = forwardRef<BottomSheet, PeaksBottomSheetProps>(
  ({ onPeakAdded }, ref) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [delayedSearchTerm, setDelayedSearchTerm] = useState("");
    const [results, setResults] = useState<Peaks[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [region, setRegion] = useState("Tatry");
    const [saving, setSaving] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);

    const { getUserByEmail, usersData } = useGetUsers();

    const [formData, setFormData] = useState({
      name: "",
      elevation: "",
      latitude: "",
      longitude: "",
      region: "Tatry",
      description: "",
      photo_url: "",
    });

    useEffect(() => {
      const loadUser = async () => {
        try {
          const authData = await getAuthenticatedUser();
          if (authData?.user?.email) {
            await getUserByEmail(authData.user.email);
          }
        } catch (error) {
          console.error("Error loading user:", error);
        }
      };
      loadUser();
    }, []);

    useEffect(() => {
      const currentUser = usersData?.[0]?.[0];
      if (currentUser?.id) {
        setUserId(currentUser.id);
      }
    }, [usersData]);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDelayedSearchTerm(searchTerm);
      }, 300);

      return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
      if (!delayedSearchTerm) {
        setResults([]);
        setShowResults(false);
        return;
      }

      peaksService
        .searchPeaks(delayedSearchTerm)
        .then((res) => {
          setResults(res.data.data || []);
          setShowResults(true);
        })
        .catch(() => {
          setResults([]);
          setShowResults(false);
        });
    }, [delayedSearchTerm]);

    const selectPeak = (peak: Peaks) => {
      setSearchTerm(peak.name);
      setShowResults(false);
      peaksService.getById(String(peak.id)).then((res) => {
        const details = res.data.data;
        if (!details) return;

        const selectedRegion = details.region || "Tatry";
        setRegion(selectedRegion);
        setFormData({
          name: details.name || "",
          elevation: details.elevation?.toString() || "",
          latitude: details.latitude?.toString() || "",
          longitude: details.longitude?.toString() || "",
          region: selectedRegion,
          description: details.description || "",
          photo_url: details.photo_url || "",
        });
      });
    };

    const clearForm = () => {
      setSearchTerm("");
      setRegion("Tatry");
      setFormData({
        name: "",
        elevation: "",
        latitude: "",
        longitude: "",
        region: "Tatry",
        description: "",
        photo_url: "",
      });
      setShowResults(false);
      (ref as any)?.current?.close();
    };

    const handleRegionChange = useCallback((selected: string) => {
      setRegion(selected);
      setFormData((prev) => ({ ...prev, region: selected }));
    }, []);

    const handleSubmit = async () => {
      if (
        !formData.name ||
        !formData.elevation ||
        !formData.latitude ||
        !formData.longitude
      ) {
        console.error("Wszystkie pola są wymagane");
        return;
      }

      if (!userId) {
        console.error("Brak ID użytkownika");
        return;
      }

      setSaving(true);

      try {
        let peakId: number | null = null;

        const existing = results.find((p) => p.name === formData.name);
        if (existing) {
          peakId = existing.id;
        } else {
          const newPeak = {
            name: formData.name,
            elevation: Number(formData.elevation),
            latitude: Number(formData.latitude),
            longitude: Number(formData.longitude),
            region: formData.region,
          };

          const res = await peaksService.create(newPeak);
          peakId = res?.data?.data?.id ?? null;
        }

        if (!peakId) throw new Error("Brak ID nowego szczytu");

        await userpeaksService.addPeakUsers(
          peakId,
          userId,
          formData.description,
          formData.photo_url,
        );

        toast.success(
          "Szczyt został dodany",
          "Gratualcje zdobycia nowego szczytu",
        );
        onPeakAdded?.();
        clearForm();
      } catch (err) {
        console.error("Błąd:", err);
        toast.error("Nie udało się dodać szczytu");
      }

      setSaving(false);
    };

    const snapPoints = useMemo(() => ["75%", "75%"], []);

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: "transparent" }}
        enablePanDownToClose={true}
        handleIndicatorStyle={{ backgroundColor: "white" }}
      >
        <View
          className="flex-1"
          style={{
            backgroundColor: "#3b82f6",
          }}
        >
          <BottomSheetScrollView contentContainerStyle={{ padding: 20 }}>
            <View>
              <View className="mb-6">
                <View className="flex-row items-center justify-center mb-2">
                  <View className="bg-white/20 p-3 rounded-full mr-3">
                    <FontAwesome6 name="crown" size={24} color="#eab308" />
                  </View>
                  <Text className="text-white text-2xl font-bold">
                    Dodaj szczyt
                  </Text>
                </View>
                <Text className="text-white/80 text-center text-sm">
                  Wyszukaj lub dodaj nowy szczyt do swojej kolekcji
                </Text>
              </View>
              <View className="bg-white/10 backdrop-blur-lg rounded-3xl p-4 mb-4 border border-white/20">
                <View className="flex-row items-center mb-2">
                  <FontAwesome6
                    name="magnifying-glass"
                    size={14}
                    color="white"
                  />
                  <Text className="text-white/90 ml-2 font-semibold text-sm">
                    Wyszukaj szczyt
                  </Text>
                </View>
                <TextInput
                  value={searchTerm}
                  onChangeText={(txt) => {
                    setSearchTerm(txt);
                    setFormData((p) => ({ ...p, name: txt }));
                  }}
                  onFocus={() => results.length > 0 && setShowResults(true)}
                  className="bg-white/20 p-3 rounded-xl text-white font-medium"
                  placeholder="Szukaj po nazwie..."
                  placeholderTextColor="rgba(255,255,255,0.6)"
                />
                {showResults && results.length > 0 && (
                  <View className="bg-white rounded-2xl mt-3 max-h-40 overflow-hidden">
                    <ScrollView>
                      {results.map((peak, idx) => (
                        <Pressable
                          key={peak.id}
                          onPress={() => selectPeak(peak)}
                          className="p-3 border-b border-gray-100"
                          style={{
                            backgroundColor:
                              idx % 2 === 0 ? "#f9fafb" : "white",
                          }}
                        >
                          <View className="flex-row items-center">
                            <FontAwesome6
                              name="mountain"
                              size={12}
                              color="#5996eb"
                            />
                            <Text className="text-gray-900 font-semibold ml-2">
                              {peak.name}
                            </Text>
                          </View>
                          <Text className="text-gray-500 text-xs mt-1 ml-5">
                            {peak.elevation} m n.p.m. •{" "}
                            {peak.region || "Nieznany region"}
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              <View className="bg-white/10 backdrop-blur-lg rounded-3xl p-4 mb-4 border border-white/20">
                <View className="flex-row items-center mb-3">
                  <FontAwesome6 name="circle-info" size={14} color="white" />
                  <Text className="text-white/90 ml-2 font-semibold text-sm">
                    Szczegóły szczytu
                  </Text>
                </View>

                <View className="mb-3">
                  <Text className="text-white/70 text-xs mb-1 ml-1">
                    Wysokość
                  </Text>
                  <View className="bg-white/20 rounded-xl flex-row items-center px-3">
                    <FontAwesome6
                      name="arrow-up"
                      size={12}
                      color="rgba(255,255,255,0.7)"
                    />
                    <TextInput
                      value={formData.elevation}
                      onChangeText={(txt) =>
                        setFormData((p) => ({ ...p, elevation: txt }))
                      }
                      className="flex-1 p-3 text-white font-medium"
                      placeholder="np. 2499"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      keyboardType="numeric"
                    />
                    <Text className="text-white/50 text-xs">m n.p.m.</Text>
                  </View>
                </View>

                <View className="flex-row gap-3 mb-3">
                  <View className="flex-1">
                    <Text className="text-white/70 text-xs mb-1 ml-1">
                      Szerokość
                    </Text>
                    <View className="bg-white/20 rounded-xl">
                      <TextInput
                        value={formData.latitude}
                        onChangeText={(txt) =>
                          setFormData((p) => ({ ...p, latitude: txt }))
                        }
                        className="p-3 text-white font-medium text-center"
                        placeholder="49.xxxx"
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                  <View className="flex-1">
                    <Text className="text-white/70 text-xs mb-1 ml-1">
                      Długość
                    </Text>
                    <View className="bg-white/20 rounded-xl">
                      <TextInput
                        value={formData.longitude}
                        onChangeText={(txt) =>
                          setFormData((p) => ({ ...p, longitude: txt }))
                        }
                        className="p-3 text-white font-medium text-center"
                        placeholder="19.xxxx"
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </View>

                <View className="mb-3">
                  <Text className="text-white/70 text-xs mb-1 ml-1">
                    Region
                  </Text>
                  <View className="bg-white/20 rounded-xl overflow-hidden">
                    <Picker
                      selectedValue={region}
                      onValueChange={handleRegionChange}
                      style={{ color: "white" }}
                    >
                      <Picker.Item label="Tatry" value="Tatry" />
                      <Picker.Item
                        label="Pasmo Radziejowej"
                        value="Pasmo Radziejowej"
                      />
                      <Picker.Item label="Beskidy" value="Beskidy" />
                    </Picker>
                  </View>
                </View>

                <View>
                  <Text className="text-white/70 text-xs mb-1 ml-1">
                    Opis (opcjonalnie)
                  </Text>
                  <View className="bg-white/20 rounded-xl">
                    <TextInput
                      value={formData.description}
                      onChangeText={(txt) =>
                        setFormData((p) => ({ ...p, description: txt }))
                      }
                      className="p-3 text-white"
                      placeholder="Twoje notatki o szczycie..."
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                    />
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-3">
                <Pressable className="flex-1" onPress={clearForm}>
                  <View className="bg-white/15 p-4 rounded-2xl border border-white/20">
                    <View className="flex-row gap-2 justify-center items-center">
                      <FontAwesome6 name="xmark" size={16} color="white" />
                      <Text className="text-white font-bold">Anuluj</Text>
                    </View>
                  </View>
                </Pressable>

                <Pressable
                  className="flex-[1.5]"
                  onPress={handleSubmit}
                  disabled={saving}
                  style={{ opacity: saving ? 0.7 : 1 }}
                >
                  <View className="bg-white p-4 rounded-2xl shadow-lg">
                    <View className="flex-row gap-2 justify-center items-center">
                      {saving ? (
                        <ActivityIndicator color="#5996eb" />
                      ) : (
                        <FontAwesome6
                          name="check-circle"
                          size={16}
                          color="#5996eb"
                        />
                      )}
                      <Text className="text-[#5996eb] font-bold">
                        {saving ? "Zapisywanie..." : "Dodaj szczyt"}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </View>
            </View>
          </BottomSheetScrollView>
        </View>
      </BottomSheet>
    );
  },
);

PeaksBottomSheet.displayName = "PeaksBottomSheet";

export default PeaksBottomSheet;
