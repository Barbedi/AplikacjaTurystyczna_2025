import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  Image,
  Pressable,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import filesService from "@/src/services/file.service";
import { api } from "@/src/config/api";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

interface Trail {
  id: number;
  name: string;
  description?: string;
  photos?: { image_name: string }[];
}

const TrailsCarousel = () => {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);
  const progress = useSharedValue<number>(0);
  const router = useRouter(); // <== DODAJ TO

  useEffect(() => {
    const fetchTrails = async () => {
      try {
        const res = await api.get("/trails/random?limit=5");
        setTrails(res.data);
        
        // Prefetch pierwszego zdjęcia dla szybszego wyświetlenia
        if (res.data[0]?.photos?.[0]) {
          const firstImageUrl = filesService.getTrailImgUrl(res.data[0].photos[0].image_name);
          Image.prefetch(firstImageUrl);
        }
      } catch (error) {
        console.error("❌ Błąd pobierania tras:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrails();
  }, []);

  if (loading) {
    return (
      <View className="flex items-center justify-center my-8">
        <ActivityIndicator size="large" color="#fff" />
        <Text className="text-white/80 mt-2">Ładowanie tras...</Text>
      </View>
    );
  }

  return (
    <View className="mt-3 p-4">
      <Text className="text-xl mx-2 font-semibold text-white">
        Proponowane trasy
      </Text>
      <Carousel
        width={width}
        height={300}
        data={trails}
        loop
        autoPlay
        mode="parallax"
        style={{ alignSelf: "center" }}
        autoPlayInterval={3500}
        scrollAnimationDuration={1000}
        pagingEnabled={false}
        renderItem={({ item }) => {
          const photo =
            item.photos && item.photos.length > 0 ? item.photos[0] : null;
          const imageUrl = photo
            ? filesService.getTrailImgUrl(photo.image_name)
            : null;

          return (
            <Pressable
              onPress={() => router.push(`/route/${item.id}`)} // ⬅️ kliknięcie otwiera stronę trasy
              className="rounded-2xl items-center justify-center bg-white/10 p-2 flex-1"
            >
              <View className="w-full h-52 rounded-2xl overflow-hidden items-center justify-center ">
                {imageUrl ? (
                  <Image
                    className="rounded-2xl"
                    source={{ uri: imageUrl }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                ) : (
                  <Text className="text-white">Brak zdjęcia</Text>
                )}
                <View
                  className="absolute bottom-0 left-0 right-0 px-4 py-3 rounded-2xl w-full"
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                >
                  <Text
                    className="text-white text-2xl font-semibold text-center"
                    numberOfLines={2}
                  >
                    {item.name}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        }}
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 52,
        }}
      />
    </View>
  );
};

export default TrailsCarousel;
