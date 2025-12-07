import { View, Text, Pressable, Image, ScrollView, Alert } from "react-native";
import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect } from "react";
import filesService from "@/src/services/file.service";
import trailsService from "@/src/services/trails.service";
import { toast } from "@/src/utils/toast";
import { Photo as PhotoType, Trails } from "@/src/types";

interface PhotoProps {
  trailId: number;
  initialPhotos?: PhotoType[];
  onPhotosUpdate?: (updatedTrail?: Trails) => void;
  readOnly?: boolean;
}

const Photo = ({ trailId, initialPhotos = [], onPhotosUpdate, readOnly = false }: PhotoProps) => {
  const [photos, setPhotos] = useState<PhotoType[]>(initialPhotos);

  useEffect(() => {
    setPhotos(initialPhotos);
  }, [initialPhotos]);

  const processImageResult = async (result: ImagePicker.ImagePickerResult) => {
    if (!trailId) {
      toast.error("Błąd wewnętrzny: Brak ID trasy");
      return;
    }

    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];

      if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
        toast.error("Plik jest zbyt duży", "Maksymalny rozmiar to 5MB");
        return;
      }

      const fileToUpload = {
        uri: asset.uri,
        name: asset.fileName || "trail_photo.jpg",
        type: asset.mimeType || "image/jpeg",
      };

      try {
        const response = await filesService.uploadTrailImage(fileToUpload);
        const filename = response.data?.file?.filename;

        if (!filename) {
          throw new Error("Brak nazwy pliku w odpowiedzi");
        }

        const newPhotoData = {
          image_name: filename,
          created_at: new Date().toISOString(),
        };

        await trailsService.updateTrailPhotos(trailId, [newPhotoData]);

        const updatedTrail = await trailsService.getTrailById(trailId);

        setPhotos(updatedTrail.data.photos || []);

        toast.success("Zdjęcie dodane pomyślnie");

        if (onPhotosUpdate) {
          onPhotosUpdate(updatedTrail.data);
        }
      } catch (error) {
        toast.error("Błąd przesyłania zdjęcia", "Spróbuj ponownie później");
      }
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      await processImageResult(result);
    } catch (error) {
      toast.error("Błąd galerii");
    }
  };

  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        toast.error("Brak uprawnień do aparatu!");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
      });

      await processImageResult(result);
    } catch (error) {
      toast.error("Błąd aparatu");
    }
  };

  const removeImage = (photoName: string) => {
    Alert.alert("Usuń zdjęcie", "Czy na pewno chcesz usunąć to zdjęcie?", [
      { text: "Anuluj", style: "cancel" },
      {
        text: "Usuń",
        style: "destructive",
        onPress: async () => {
          try {
            await trailsService.deleteTrailPhoto(trailId, photoName);

            const updatedTrail = await trailsService.getTrailById(trailId);

            setPhotos(updatedTrail.data.photos || []);
            toast.success("Zdjęcie usunięte");

            onPhotosUpdate?.(updatedTrail.data);
          } catch (error) {
            toast.error("Nie udało się usunąć zdjęcia");
          }
        },
      },
    ]);
  };

  return (
    <View className="w-full">
      {!readOnly && (
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
      )}

      {photos.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
        >
          {photos.map((photo, index) => {
            const url =
              filesService.getTrailImgUrl(photo.image_name) +
              `?t=${Date.now()}`;

            return (
              <View key={index} className="relative">
                <Image
                  source={{ uri: url }}
                  className="w-40 h-40 rounded-2xl bg-black/20"
                  resizeMode="cover"
                />

                {!readOnly && (
                  <Pressable
                    onPress={() => removeImage(photo.image_name)}
                    className="absolute top-2 right-2 bg-red-500 rounded-full w-8 h-8 justify-center items-center"
                  >
                    <FontAwesome6 name="trash" size={14} color="#ffffff" />
                  </Pressable>
                )}
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View className="py-10 items-center">
          <FontAwesome6 name="image" size={50} color="#ffffff40" />
          <Text className="text-white/40 text-center mt-3">
            Brak zdjęć.
            {!readOnly && " Dodaj pierwsze zdjęcie!"}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Photo;
