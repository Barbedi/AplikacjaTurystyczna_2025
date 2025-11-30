import { View, Text, Image, ScrollView, Pressable } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";

const images = {
  tatry: require("../../../assets/DiscoverPhoto/FullSizeRender.webp"),
  sadecki: require("../../../assets/DiscoverPhoto/FullSizeRender2.webp"),
  wyspowy: require("../../../assets/DiscoverPhoto/IMG_4048.webp"),
};

const modules = [
  { title: "Tatry", photo: images.tatry },
  { title: "Beskid Sądecki", photo: images.sadecki },
  { title: "Beskid Wyspowy", photo: images.wyspowy },
];

const Discover = () => {
  const router = useRouter();

  useEffect(() => {
    Image.prefetch(Image.resolveAssetSource(images.tatry).uri);
    Image.prefetch(Image.resolveAssetSource(images.sadecki).uri);
    Image.prefetch(Image.resolveAssetSource(images.wyspowy).uri);
  }, []);

  return (
    <View className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
      <Text className="text-xl font-semibold text-white mb-3 mx-2">
        Odkryj trasy w ...
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 9, gap: 15 }}
      >
        {modules.map((item, index) => (
          <Pressable
            key={index}
            className="w-28 items-center mt-2"
            onPress={() => router.push(`/region/${item.title}`)}
          >
            <View className="w-28 h-28 rounded-full overflow-hidden bg-black/30">
              <Image
                source={item.photo}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </View>

            <Text
              className="text-white font-medium text-center mt-2"
              numberOfLines={2}
            >
              {item.title}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

export default Discover;
