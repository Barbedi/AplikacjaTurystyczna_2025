import React, { useState } from "react";
import { Modal, View, Text, Pressable, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

interface SaveTrailModalProps {
  visible: boolean;
  title?: string;
  onCancel: () => void;
  onConfirm: (trailName: string) => void;
}

const SaveTrailModal: React.FC<SaveTrailModalProps> = ({
  visible,
  title = "Zapisz trasę",
  onCancel,
  onConfirm,
}) => {
  const [trailName, setTrailName] = useState("");

  const handleConfirm = () => {
    if (trailName.trim()) {
      onConfirm(trailName.trim());
      setTrailName("");
    }
  };

  const handleCancel = () => {
    setTrailName("");
    onCancel();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View
        className="flex-1 justify-center items-center px-5"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      >
        <LinearGradient
          colors={["#999999", "#5996eb"]}
          className="rounded-3xl w-full max-w-sm overflow-hidden"
          style={{ borderRadius: 24 }}
        >
          <View className="px-6  mt-4">
            <View className="items-center mb-6s">
              <View className="bg-white/20 w-16 h-16 rounded-full items-center justify-center mb-5 backdrop-blur">
                <FontAwesome6 name="route" size={30} color="#ffffff" />
              </View>
              <Text className="text-white text-2xl font-bold text-center mb-1">
                {title}
              </Text>
              <Text className="text-white/70 text-center text-sm ">
                Nadaj nazwę swojej trasie
              </Text>
            </View>

            <View className="mb-6">
              <View className="bg-white/20 rounded-2xl px-5 py-4 flex-row items-center border border-white/30">
                <FontAwesome6 name="pen" size={16} color="#ffffff80" />
                <TextInput
                  placeholder="Nazwa trasy"
                  placeholderTextColor="#ffffff80"
                  value={trailName}
                  onChangeText={setTrailName}
                  className="flex-1 ml-3 text-white text-base"
                  autoFocus
                  maxLength={50}
                />
              </View>
              <Text className="text-white/50 text-xs mt-3 ml-1">
                {trailName.length}/50 znaków
              </Text>
            </View>

            <View className="flex-row gap-3 mb-4">
              <Pressable
                onPress={handleCancel}
                className="flex-1 bg-white/20 rounded-xl py-3 items-center border border-white/30"
              >
                <Text className="text-white font-semibold text-base">
                  Anuluj
                </Text>
              </Pressable>

              <Pressable
                onPress={handleConfirm}
                disabled={!trailName.trim()}
                className={`flex-1  rounded-xl py-3 items-center border border-white/30 ${
                  trailName.trim() ? " sbg-white/20" : "bg-transparent"
                }`}
              >
                <Text
                  className={`font-bold text-base ${
                    trailName.trim() ? "text-white" : "text-white/50"
                  }`}
                >
                  Zapisz
                </Text>
              </Pressable>
            </View>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

export default SaveTrailModal;
