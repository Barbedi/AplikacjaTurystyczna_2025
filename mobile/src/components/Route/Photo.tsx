import { View, Text, Pressable, Image, ScrollView } from "react-native";
import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

const Photo = () => {
  const [images, setImages] = useState<string[]>([]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert("Brak uprawnień do aparatu!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImages((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <View className="w-full">
      <View className="flex-row gap-4 mb-5">
        <Pressable
          className="flex-1 h-32 bg-white/20 rounded-2xl justify-center items-center"
          onPress={takePhoto}
        >
          <FontAwesome6 name="camera" size={30} color="#ffffff" />
          <Text className="text-white text-center text-sm mt-2">
            Zrób zdjęcie
          </Text>
        </Pressable>

        <Pressable
          className="flex-1 h-32 bg-white/20 rounded-2xl justify-center items-center"
          onPress={pickImage}
        >
          <FontAwesome6 name="images" size={30} color="#ffffff" />
          <Text className="text-white text-center text-sm mt-2">
            Wybierz z galerii
          </Text>
        </Pressable>
      </View>

      {images.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
        >
          {images.map((uri, index) => (
            <View key={index} className="relative">
              <Image
                source={{ uri }}
                className="w-40 h-40 rounded-2xl"
                resizeMode="cover"
              />
              <Pressable
                onPress={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 rounded-full w-8 h-8 justify-center items-center"
              >
                <FontAwesome6 name="trash" size={14} color="#ffffff" />
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}

      {images.length === 0 && (
        <View className="py-10 items-center">
          <FontAwesome6 name="image" size={50} color="#ffffff40" />
          <Text className="text-white/40 text-center mt-3">
            Brak zdjęć. Dodaj pierwsze zdjęcie!
          </Text>
        </View>
      )}
    </View>
  );
};

export default Photo;
