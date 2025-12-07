import React from "react";
import { Modal, View, Text, Pressable } from "react-native";
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
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable
        className="flex-1 justify-center items-center px-5 bg-black/50"
        onPress={onCancel}
      >
        <Pressable
          className="bg-gray-900/95 rounded-3xl w-full max-w-sm overflow-hidden border border-white/10 shadow-2xl"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="px-6 py-6">
            <View className="items-center mb-6">
              <View className="bg-red-500/20 w-16 h-16 rounded-full items-center justify-center mb-4">
                <FontAwesome6 name="trash-can" size={28} color="#ef4444" />
              </View>
              <Text className="text-white text-2xl font-bold text-center mb-2">
                {title}
              </Text>
              <Text className="text-gray-400 text-center text-sm">
                {message}
              </Text>
            </View>

            <View className="flex-row gap-3">
              <Pressable
                onPress={onCancel}
                className="flex-1 bg-gray-800 rounded-xl py-3.5 items-center border border-gray-700/50 active:bg-gray-700"
              >
                <Text className="text-gray-300 font-semibold text-base">
                  Anuluj
                </Text>
              </Pressable>

              <Pressable
                onPress={onConfirm}
                className="flex-1 bg-red-500 rounded-xl py-3.5 items-center active:bg-red-600"
              >
                <Text className="text-white font-bold text-base">Usuń</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ConfirmDeleteModal;