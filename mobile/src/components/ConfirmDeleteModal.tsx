import React from "react";
import { Modal, View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

interface ConfirmDeleteModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  visible,
  title = "Usuń element?",
  message = "Tej operacji nie będzie można cofnąć.",
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View
        className="flex-1 justify-center items-center p-6 "
        style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
      >
        <LinearGradient
          colors={[ "#999999","#5996eb"]}
          className="rounded-2xl p-5 border-2 border-white/20 w-full max-w-sm"
          style={{ borderRadius: 16 }}
        >
          <View className="items-center mb-4">
            <View className="bg-red-500/20 w-16 h-16 rounded-full items-center justify-center mb-3">
              <FontAwesome6 name="trash-can" size={28} color="#ef4444" />
            </View>
            <Text className="text-white text-xl font-bold text-center mb-2">
              {title}
            </Text>
            <Text className="text-white/70 text-sm text-center">{message}</Text>
          </View>

          <View className="flex-row justify-between gap-3">
            <Pressable
              onPress={onCancel}
              className="flex-1 bg-white/20 rounded-xl py-3 items-center border border-white/30"
            >
              <Text className="text-white font-bold">Anuluj</Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              className="flex-1 bg-red-500 rounded-xl py-3 items-center"
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text className="text-white font-bold">Usuń</Text>
            </Pressable>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

export default ConfirmDeleteModal;
