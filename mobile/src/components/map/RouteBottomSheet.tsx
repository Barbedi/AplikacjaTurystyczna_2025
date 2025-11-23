import React, { forwardRef, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { FontAwesome6 } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";

interface RouteBottomSheetProps {
  clickedPoints: Array<{ coords: [number, number]; name?: string }>;
  routeGeoJson: any;
  onClearRoute: () => void;
  onRemovePoint: (index: number) => void;
  onSaveRoute: (routeData: any) => void;
  saving?: boolean;
}

const RouteBottomSheet = forwardRef<BottomSheet, RouteBottomSheetProps>(
  (
    {
      clickedPoints,
      routeGeoJson,
      onClearRoute,
      onRemovePoint,
      onSaveRoute,
      saving = false,
    },
    ref,
  ) => {
    const snapPoints = useMemo(() => ["25%", "50%", "80%"], []);
    const [routeName, setRouteName] = useState("");
    const [openType, setOpenType] = useState(false);
    const [openRegion, setOpenRegion] = useState(false);
    const [openDifficulty, setOpenDifficulty] = useState(false);

    const [typeValue, setTypeValue] = useState("one-way");
    const [regionValue, setRegionValue] = useState("tatry");
    const [routeTypes, setRouteTypes] = useState([
      { label: "W jedną stronę", value: "one-way" },
      { label: "Pętla", value: "loop" },
      { label: "W tą i z powrotem", value: "back-and-forth" },
    ]);
    const [difficultyValue, setDifficultyValue] = useState([]);
    const [routeDifficulties, setRouteDifficulties] = useState([
      { label: "Łatwy", value: "easy" },
      { label: "Średni", value: "medium" },
      { label: "Trudny", value: "hard" },
    ]);

    const [regions, setRegions] = useState([
      { label: "Tatry", value: "tatry" },
      { label: "Beskid Sądecki", value: "sadecki" },
    ]);

    // Calculate route statistics
    const routeStats = useMemo(() => {
      if (!routeGeoJson?.features?.[0]) {
        return { distance: 0, elevationGain: 0, elevationLoss: 0, duration: 0 };
      }

      const feature = routeGeoJson.features[0];
      const coords = feature.geometry.coordinates;
      const distance = feature.properties?.distance || 0;

      let elevationGain = 0;
      let elevationLoss = 0;

      if (coords && coords.length > 0 && coords[0][2] !== undefined) {
        for (let i = 1; i < coords.length; i++) {
          const diff = coords[i][2] - coords[i - 1][2];
          if (diff > 0) elevationGain += diff;
          else elevationLoss += Math.abs(diff);
        }
      }

      const distanceKm = distance / 1000;
      const duration = distanceKm / 5 + elevationGain / 300;

      return {
        distance: Math.round(distance),
        elevationGain: Math.round(elevationGain),
        elevationLoss: Math.round(elevationLoss),
        duration: Math.round(duration * 60),
      };
    }, [routeGeoJson]);

    if (clickedPoints.length < 2) {
      return null;
    }

    const clear = () => {
      onClearRoute();
      setRouteName("");
      setRegionValue("tatry");
      setTypeValue("one-way");
      setDifficultyValue([]);
    };

    const handleSave = () => {
      const routeData = {
        name: routeName || "Moja trasa",
        points: clickedPoints,
        routeType: typeValue,
        region: regionValue,
        difficulty: difficultyValue,
        geometry: routeGeoJson,
        stats: routeStats,
      };
      onSaveRoute(routeData);
    };

    return (
      <BottomSheet
        ref={ref}
        snapPoints={snapPoints}
        index={0}
        enablePanDownToClose={false}
        backgroundStyle={{ backgroundColor: "#5996eb" }}
      >
        <BottomSheetScrollView contentContainerStyle={{ padding: 16 }}>
          <View className="flex-col">
            <View className="justify-center items-center">
              <Text className="text-white text-xl font-bold mb-4">
                Planer trasy
              </Text>
            </View>
            <TextInput
              value={routeName}
              onChangeText={setRouteName}
              className="bg-white/30 p-3 rounded-2xl mb-4"
              placeholder="Nazwa trasy"
              placeholderTextColor="#ffffff"
            />
            <View className="mb-4">
              <Text className="text-white/70 mb-2 text-sm font-semibold">
                Punkty trasy ({clickedPoints.length})
              </Text>
              {clickedPoints.map((point, index) => (
                <View
                  key={`route-point-${index}`}
                  className="bg-white/10 p-3 rounded-xl mb-2 flex-row justify-between items-center"
                >
                  <View className="flex-row items-center gap-3">
                    <View>
                      <Text className="text-white font-semibold">
                        {point.name || `Punkt ${index + 1}`}
                      </Text>
                      <Text className="text-white/50 text-xs">
                        {point.coords[1].toFixed(4)},{" "}
                        {point.coords[0].toFixed(4)}
                      </Text>
                    </View>
                  </View>
                  <Pressable onPress={() => onRemovePoint(index)}>
                    <FontAwesome6 name="trash" size={16} color="#ef4444" />
                  </Pressable>
                </View>
              ))}
            </View>
            <View className="mb-4">
              <View
                className="flex-row gap-2 justify-between"
                style={{ zIndex: 3000 }}
              >
                <View
                  className="flex-1"
                  style={{ zIndex: openType ? 3000 : 1 }}
                >
                  <Text className="text-white/70 mb-2 text-sm font-semibold">
                    Typ trasy
                  </Text>
                  <DropDownPicker
                    open={openType}
                    value={typeValue}
                    items={routeTypes}
                    setOpen={setOpenType}
                    setValue={setTypeValue}
                    setItems={setRouteTypes}
                    placeholder="Wybierz typ"
                    listMode="SCROLLVIEW"
                    scrollViewProps={{
                      nestedScrollEnabled: true,
                    }}
                    style={{
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderColor: "transparent",
                      borderRadius: 12,
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      minHeight: 44,
                    }}
                    dropDownContainerStyle={{
                      backgroundColor: "rgba(255,255,255,0.95)",
                      borderColor: "rgba(255,255,255,0.2)",
                      borderRadius: 12,
                      marginTop: 4,
                    }}
                    textStyle={{
                      color: "white",
                      fontSize: 14,
                    }}
                    placeholderStyle={{
                      color: "rgba(255,255,255,0.7)",
                    }}
                    arrowIconStyle={{
                      // @ts-ignore
                      tintColor: "white",
                    }}
                    tickIconStyle={{
                      // @ts-ignore
                      tintColor: "#5996eb",
                    }}
                    listItemLabelStyle={{
                      color: "#1e293b",
                    }}
                  />
                </View>

                <View
                  className="flex-1"
                  style={{ zIndex: openRegion ? 2000 : 1 }}
                >
                  <Text className="text-white/70 mb-2 text-sm font-semibold">
                    Region
                  </Text>
                  <DropDownPicker
                    open={openRegion}
                    value={regionValue}
                    items={regions}
                    setOpen={setOpenRegion}
                    setValue={setRegionValue}
                    setItems={setRegions}
                    placeholder="Wybierz region"
                    listMode="SCROLLVIEW"
                    scrollViewProps={{
                      nestedScrollEnabled: true,
                    }}
                    style={{
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderColor: "transparent",
                      borderRadius: 12,
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      minHeight: 44,
                    }}
                    dropDownContainerStyle={{
                      backgroundColor: "rgba(255,255,255,0.95)",
                      borderColor: "rgba(255,255,255,0.2)",
                      borderRadius: 12,
                      marginTop: 4,
                    }}
                    textStyle={{
                      color: "white",
                      fontSize: 14,
                    }}
                    placeholderStyle={{
                      color: "rgba(255,255,255,0.7)",
                    }}
                    arrowIconStyle={{
                      // @ts-ignore
                      tintColor: "white",
                    }}
                    tickIconStyle={{
                      // @ts-ignore
                      tintColor: "#5996eb",
                    }}
                    listItemLabelStyle={{
                      color: "#1e293b",
                    }}
                  />
                </View>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-white/70 mb-2 text-sm font-semibold">
                Ustal poziom trudności
              </Text>
              <DropDownPicker
                open={openDifficulty}
                multiple={true}
                value={difficultyValue}
                items={routeDifficulties}
                setOpen={setOpenDifficulty}
                setValue={setDifficultyValue}
                setItems={setRouteDifficulties}
                placeholder="Wybierz poziom trudności"
                listMode="SCROLLVIEW"
                zIndex={1000}
                scrollViewProps={{
                  nestedScrollEnabled: true,
                }}
                style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderColor: "transparent",
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  minHeight: 44,
                }}
                dropDownContainerStyle={{
                  backgroundColor: "rgba(255,255,255,0.95)",
                  borderColor: "rgba(255,255,255,0.2)",
                  borderRadius: 12,
                  marginTop: 4,
                }}
                textStyle={{
                  color: "white",
                  fontSize: 14,
                }}
                placeholderStyle={{
                  color: "rgba(255,255,255,0.7)",
                }}
                arrowIconStyle={{
                  // @ts-ignore
                  tintColor: "white",
                }}
                tickIconStyle={{
                  // @ts-ignore
                  tintColor: "#5996eb",
                }}
                listItemLabelStyle={{
                  color: "#1e293b",
                }}
              />
            </View>

            <View className="mb-4">
              <Text className="text-white/70 mb-2 text-sm font-semibold">
                Podsumowanie
              </Text>
              <View className="bg-white/10 p-4 rounded-2xl">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-white">Długość trasy:</Text>
                  <Text className="text-white font-semibold">
                    {routeStats.distance > 0
                      ? `${(routeStats.distance / 1000).toFixed(2)} km`
                      : "-- km"}
                  </Text>
                </View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-white">Czas przejścia:</Text>
                  <Text className="text-white font-semibold">
                    {routeStats.duration > 0
                      ? `${routeStats.duration} min`
                      : "-- min"}
                  </Text>
                </View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-white">Suma podejść:</Text>
                  <Text className="text-white font-semibold">
                    {routeStats.elevationGain > 0
                      ? `${routeStats.elevationGain} m`
                      : "-- m"}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-white">Suma zejść:</Text>
                  <Text className="text-white font-semibold">
                    {routeStats.elevationLoss > 0
                      ? `${routeStats.elevationLoss} m`
                      : "-- m"}
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row gap-4 ">
              <Pressable
                className="bg-red-500 p-3 rounded-lg mt-4 w-[48%]"
                onPress={clear}
              >
                <View className="flex-row gap-4 justify-center items-center">
                  <FontAwesome6 name="trash" size={19} color="white" />
                  <Text className="text-white text-center font-semibold">
                    Wyczyść trasę
                  </Text>
                </View>
              </Pressable>
              <Pressable
                className="bg-white/30 p-3 rounded-lg mt-4 w-[48%]"
                onPress={handleSave}
                disabled={saving}
                style={{ opacity: saving ? 0.5 : 1 }}
              >
                <View className="flex-row gap-4 justify-center items-center">
                  {saving ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <FontAwesome6
                      name="heart-circle-check"
                      size={19}
                      color="white"
                    />
                  )}
                  <Text className="text-white text-center font-semibold">
                    {saving ? "Zapisywanie..." : "Zapisz trasę"}
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    );
  },
);

RouteBottomSheet.displayName = "RouteBottomSheet";

export default RouteBottomSheet;
