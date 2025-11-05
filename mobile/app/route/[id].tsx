import { useLocalSearchParams } from "expo-router";
import { View, Text, ActivityIndicator, ScrollView, Image } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

const RouteDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const res = await axios.get(`http://10.0.2.2:6868/trails/${id}`);
        setData(res.data);
      } catch (err) {
        console.error("Błąd pobierania trasy:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoute();
  }, [id]);

  if (!data)
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-white">Nie znaleziono trasy</Text>
      </View>
    );

  return (
    <LinearGradient colors={["#5996eb", "#050c28"]} className="flex-1">
      <SafeAreaView className="flex-1">
        <ScrollView
          contentContainerStyle={{
            padding: 20,
            flexGrow: 1,
            paddingBottom: 60,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={{ uri: data.image_url }}
            style={{ width: "100%", height: 250 }}
            resizeMode="cover"
          />
          <View className="p-5">
            <Text className="text-3xl text-white font-bold">{data.name}</Text>
            <Text className="text-white/70 mt-2">{data.description}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default RouteDetails;
