import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";

export default function WeatherWidgetMobile() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const API_KEY = process.env.EXPO_OPENWEATHER_API_KEY;
  const CITY = process.env.EXPO_WEATHER_CITY;

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric&lang=pl`,
        );
        const data = await res.json();
        setWeather(data);
      } catch (err) {
        console.error("❌ Błąd pobierania pogody:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  if (loading) {
    return (
      <View className="items-center justify-center my-3">
        <ActivityIndicator size="small" color="#fff" />
      </View>
    );
  }

  if (!weather || !weather.main) {
    return (
      <View className="items-center my-3">
        <Text className="text-white/70">Brak danych pogodowych</Text>
      </View>
    );
  }

  return (
    <View className="p-4 w-full">
      <View className="flex-row items-center space-x-4">
        <Image
          source={{
            uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
          }}
          style={{ width: 60, height: 60 }}
        />
        <View>
          <Text className="text-white text-3xl font-bold">
            {Math.round(weather.main.temp)}°C
          </Text>
          <Text className="text-white/80 capitalize">
            {weather.weather[0].description}
          </Text>
        </View>
      </View>

      <Text className="text-white/70 mt-2">
        {weather.name} - Wiatr {Math.round(weather.wind.speed)} m/s
      </Text>
    </View>
  );
}
