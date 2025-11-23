import React from "react";
import { Modal, View, Text, Pressable } from "react-native";
import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6";
import { Peaks, Shelters } from "@/src/types";

interface ModalShelterPeakProps {
  visible: boolean;
  selectedFeature: {
    type: "shelter" | "peak";
    data: Shelters | Peaks;
  } | null;
  onClose: () => void;
  onAddToRoute: (coords: [number, number], name: string) => void;
}

const ModalShelterPeak = ({
  visible,
  selectedFeature,
  onClose,
  onAddToRoute,
}: ModalShelterPeakProps) => {
  const handleAddToRoute = () => {
    if (selectedFeature) {
      const coord: [number, number] = [
        selectedFeature.data.longitude,
        selectedFeature.data.latitude,
      ];
      onAddToRoute(coord, selectedFeature.data.name);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-center items-center"
        onPress={onClose}
      >
        <Pressable
          className="bg-white rounded-2xl p-5 w-[85%] max-w-[400px]"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
          onPress={(e) => e.stopPropagation()}
        >
          <View className="flex-row mb-4">
            <Text className="text-xl font-bold text-slate-800 text-center flex-1">
              {selectedFeature?.type === "shelter" ? (
                <FontAwesome6 name="tent" size={19} color="black" />
              ) : (
                <FontAwesome6 name="mountain" size={19} color="black" />
              )}{" "}
              {selectedFeature?.type === "shelter" ? "Schronisko" : "Szczyt"}
            </Text>
            <Pressable onPress={onClose}>
              <Text className="text-2xl text-slate-500 font-bold">✕</Text>
            </Pressable>
          </View>

          <View className="mb-5">
            <Text className="text-lg font-semibold text-slate-900 mb-4">
              {selectedFeature?.data.name}
            </Text>

            <View className="flex-row justify-between py-2 border-b border-slate-200">
              <Text className="text-sm text-slate-500 font-medium">
                Wysokość:
              </Text>
              <Text className="text-sm text-slate-800 font-semibold">
                {selectedFeature?.type === "peak"
                  ? `${(selectedFeature.data as Peaks).elevation} m n.p.m.`
                  : selectedFeature
                    ? `${(selectedFeature.data as Shelters).altitude} m n.p.m.`
                    : ""}
              </Text>
            </View>

            <View className="flex-row justify-between py-2 border-b border-slate-200">
              <Text className="text-sm text-slate-500 font-medium">
                Współrzędne:
              </Text>
              <Text className="text-sm text-slate-800 font-semibold">
                {selectedFeature?.data.latitude.toFixed(4)},{" "}
                {selectedFeature?.data.longitude.toFixed(4)}
              </Text>
            </View>

            {selectedFeature?.type === "peak" &&
              (selectedFeature.data as Peaks).region && (
                <View className="flex-row justify-between py-2 border-b border-slate-200">
                  <Text className="text-sm text-slate-500 font-medium">
                    Region:
                  </Text>
                  <Text className="text-sm text-slate-800 font-semibold">
                    {(selectedFeature.data as Peaks).region}
                  </Text>
                </View>
              )}

            {selectedFeature?.type === "shelter" &&
              (selectedFeature.data as Shelters).mountain_range && (
                <View className="flex-row justify-between py-2 border-b border-slate-200">
                  <Text className="text-sm text-slate-500 font-medium">
                    Pasmo:
                  </Text>
                  <Text className="text-sm text-slate-800 font-semibold">
                    {(selectedFeature.data as Shelters).mountain_range}
                  </Text>
                </View>
              )}
          </View>

          <View className="flex-row gap-4">
            <Pressable
              className="bg-[#2e3238] rounded-2xl py-3 items-center w-[48%]"
              onPress={onClose}
            >
              <View className="flex-row items-center justify-center gap-2">
                <FontAwesome6 name="circle-xmark" size={18} color="#ffffff" />
                <Text className="text-white text-base font-semibold">
                  Zamknij
                </Text>
              </View>
            </Pressable>
            <Pressable
              className="bg-[#5996eb] rounded-2xl py-3 items-center w-[48%]"
              onPress={handleAddToRoute}
            >
              <View className="flex-row items-center justify-center gap-2">
                <FontAwesome6 name="circle-plus" size={18} color="#ffffff" />
                <Text className="text-white text-base font-semibold">
                  Dodaj do trasy
                </Text>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ModalShelterPeak;
