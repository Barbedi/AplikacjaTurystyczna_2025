import React, { useState } from "react";
import { Modal, View, Text, Pressable, TextInput } from "react-native";
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
      <Pressable 
        className="flex-1 justify-center items-center px-5 bg-black/50"
        onPress={handleCancel}
      >
        <Pressable 
          className="bg-gray-900/95 rounded-3xl w-full max-w-sm overflow-hidden border border-white/10 shadow-2xl"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="px-6 py-6">
            <View className="items-center mb-6">
              <View className="bg-blue-500/20 w-16 h-16 rounded-full items-center justify-center mb-4">
                <FontAwesome6 name="route" size={28} color="#3b82f6" />
              </View>
              <Text className="text-white text-2xl font-bold text-center mb-2">
                {title}
              </Text>
              <Text className="text-gray-400 text-center text-sm">
                Nadaj nazwę swojej trasie
              </Text>
            </View>

            <View className="mb-6">
              <View className="bg-gray-800/80 rounded-2xl px-4 py-4 flex-row items-center border border-gray-700/50">
                <FontAwesome6 name="pen" size={16} color="#9ca3af" />
                <TextInput
                  placeholder="Nazwa trasy"
                  placeholderTextColor="#6b7280"
                  value={trailName}
                  onChangeText={setTrailName}
                  className="flex-1 ml-3 text-white text-base"
                  autoFocus
                  maxLength={50}
                />
              </View>
              <Text className="text-gray-500 text-xs mt-2 ml-1">
                {trailName.length}/50 znaków
              </Text>
            </View>

            <View className="flex-row gap-3">
              <Pressable
                onPress={handleCancel}
                className="flex-1 bg-gray-800 rounded-xl py-3.5 items-center border border-gray-700/50 active:bg-gray-700"
              >
                <Text className="text-gray-300 font-semibold text-base">
                  Anuluj
                </Text>
              </Pressable>

              <Pressable
                onPress={handleConfirm}
                disabled={!trailName.trim()}
                className={`flex-1 rounded-xl py-3.5 items-center ${
                  trailName.trim()
                    ? "bg-blue-500 active:bg-blue-600"
                    : "bg-gray-800/50 border border-gray-700/30"
                }`}
              >
                <Text
                  className={`font-bold text-base ${
                    trailName.trim() ? "text-white" : "text-gray-600"
                  }`}
                >
                  Zapisz
                </Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default SaveTrailModal;