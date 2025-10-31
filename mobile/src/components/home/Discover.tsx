import { View, Text, Image } from "react-native";
import { useEffect } from "react";

const images = {
  tatry: require("../../../assets/DiscoverPhoto/FullSizeRender.webp"),
  sadecki: require("../../../assets/DiscoverPhoto/FullSizeRender2.webp"),
  wyspowy: require("../../../assets/DiscoverPhoto/IMG_4048.webp"),
};

const modules = [
  {
    title: "Tatry",
    photo: images.tatry,
  },
  {
    title: "Beskid Sądecki",
    photo: images.sadecki,
  },
  {
    title: "Beskid Wyspowy",
    photo: images.wyspowy,
  },
];

const Discover = () => {
  useEffect(() => {
    Image.prefetch(Image.resolveAssetSource(images.tatry).uri);
    Image.prefetch(Image.resolveAssetSource(images.sadecki).uri);
    Image.prefetch(Image.resolveAssetSource(images.wyspowy).uri);
  }, []);

  return (
    <View className="mt-5 bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
      <View className="mb-2 flex flex-col">
        <Text className="text-xl mx-2 font-semibold text-white">
          Odkryj trasy w ...
        </Text>
        <View className="flex flex-row mt-3 justify-center items-center">
          {modules.map((item, index) => (
            <View key={index} className="mx-3">
              <View className="flex flex-col items-center">
                <View className="w-28 aspect-square rounded-xl bg-black/40 items-center justify-center">
                  <Image
                    source={item.photo}
                    style={{ width: "100%", height: "100%", borderRadius: 10 }}
                    resizeMode="cover"
                    className="rounded-2xl"
                  />
                </View>
                <View className="mt-2">
                  <Text className="text-white font-medium text-center">
                    {item.title}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
export default Discover;
