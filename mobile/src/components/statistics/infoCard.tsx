import React from "react";
import { View, Text } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

const InfoCard = ({
  label,
  icon,
  value,
}: {
  label: string;
  icon: any;
  value: string | number;
}) => (
  <View className="w-full bg-white/10 rounded-xl border border-white/20 p-5 mb-3">
    <View className="flex-row items-center justify-center mb-1">
      <FontAwesome6 name={icon} size={18} color="#ffffff" />
      <Text className="text-white text-base ml-2">{label}</Text>
    </View>
    <Text className="text-white text-center text-lg font-semibold">
      {value}
    </Text>
  </View>
);

export default InfoCard;
