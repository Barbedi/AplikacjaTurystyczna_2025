import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";
import { BlurView } from "expo-blur";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

interface ShareModalProps {
  visible: boolean;
  onConfirm: (description: string) => void;
  onCancel: () => void;
  title?: string;
}

const ShareModal = ({
  visible,
  onConfirm,
  onCancel,
  title = "Udostępnij trasę",
}: ShareModalProps) => {
  const [description, setDescription] = useState("");

  const handleConfirm = () => {
    onConfirm(description);
    setDescription(""); // Reset after confirm
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.centeredView}>
        <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
        <View style={styles.modalView}>
          <View className="bg-cyan-500/20 w-16 h-16 rounded-full items-center justify-center mb-4">
            <FontAwesome6 name="share-nodes" size={32} color="#06b6d4" />
          </View>

          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalText}>
            Dodaj opis do udostępnianej trasy (opcjonalne)
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Opis trasy..."
            placeholderTextColor="#9ca3af"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.buttonCancel]}
              onPress={onCancel}
            >
              <Text style={styles.textStyleCancel}>Anuluj</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonConfirm]}
              onPress={handleConfirm}
            >
              <Text style={styles.textStyleConfirm}>Udostępnij</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#1e293b",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    width: "85%",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  modalTitle: {
    marginBottom: 8,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 14,
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 12,
    color: "#fff",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    marginBottom: 20,
    height: 80,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  button: {
    borderRadius: 12,
    padding: 14,
    elevation: 0,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonConfirm: {
    backgroundColor: "#06b6d4",
  },
  buttonCancel: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  textStyleConfirm: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  textStyleCancel: {
    color: "#94a3b8",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default ShareModal;
