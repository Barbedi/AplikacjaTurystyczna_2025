import { View, Text, Image, ScrollView } from "react-native";
import { useEffect } from "react";

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
  useEffect(() => {
    Image.prefetch(Image.resolveAssetSource(images.tatry).uri);
    Image.prefetch(Image.resolveAssetSource(images.sadecki).uri);
    Image.prefetch(Image.resolveAssetSource(images.wyspowy).uri);
  }, []);

  return (
    <View className="mt-5 bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
      <Text className="text-xl font-semibold text-white mb-3 mx-2">
        Odkryj trasy w ...
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 9, gap: 15 }}
      >
        {modules.map((item, index) => (
          <View key={index} className="w-28 items-center mt-5">
            <View className="w-28 h-28 rounded-xl overflow-hidden bg-black/30">
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
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Discover;
