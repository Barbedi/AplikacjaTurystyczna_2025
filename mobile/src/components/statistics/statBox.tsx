import React from "react";
import { View, Text } from "react-native";

const StatBox = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <View className="items-center flex-1">
    <Text className="text-white text-xl font-bold">{value}</Text>
    <Text className="text-white text-xs">{label}</Text>
  </View>
);

export default StatBox;
