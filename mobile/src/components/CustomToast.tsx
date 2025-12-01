import { View, Text } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

export function CustomToast({
  text1,
  text2,
  type,
}: {
  text1?: string;
  text2?: string;
  type: "success" | "error" | "info";
}) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <FontAwesome6 name="check-circle" size={22} color="#22c55e" />;
      case "error":
        return <FontAwesome6 name="circle-xmark" size={22} color="#ef4444" />;
      case "info":
        return <FontAwesome6 name="circle-info" size={22} color="#3b82f6" />;
    }
  };

  const getColor = () => {
    switch (type) {
      case "success":
        return "border-green-500";
      case "error":
        return "border-red-500";
      case "info":
        return "border-blue-500";
    }
  };

  return (
    <View
      className={`w-[90%] bg-black/70 rounded-2xl p-4 flex-row items-center gap-3 border  border-l-4 ${getColor()}`}
    >
      {getIcon()}
      <View className="flex-shrink">
        <Text
          className={`text-white text-lg font-bold ${text2 ? "mb-0.5" : ""}`}
        >
          {text1}
        </Text>

        {text2 && <Text className="text-sm text-white">{text2}</Text>}
      </View>
    </View>
  );
}
