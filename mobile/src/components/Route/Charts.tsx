import React, { useMemo } from "react";
import { Text, View, Dimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { Trails } from "../../types";

const CHART_CONFIG = {
  colors: {
    primary: "#A855F7",
    gradientStart: "#A855F7",
    gradientEnd: "#232D4B",
    text: "#cbd5e1",
    axis: "#ffffff20",
    textMuted: "#94a3b8",
  },
  layout: {
    height: 180,
    maxPoints: 60,
    yAxisBuffer: { bottom: 0.1, top: 0.15 },
  },
};

interface ElevationDataProps {
  trail?: Trails;
}

const useChartData = (trail: Trails | undefined, chartWidth: number) => {
  return useMemo(() => {
    const defaultResult = {
      elevationData: [],
      yAxisOffset: 0,
      maxValue: 100,
      spacing: 0,
      totalDistanceKm: 0,
      hasData: false,
    };

    if (!trail?.geometry?.coordinates) return defaultResult;

    const coords = trail.geometry.coordinates as [number, number, number][];
    const totalDistanceKm = Number(trail.length_km) || 0;

    const step =
      coords.length > CHART_CONFIG.layout.maxPoints
        ? Math.ceil(coords.length / CHART_CONFIG.layout.maxPoints)
        : 1;

    const sampledCoords = coords.filter((_, index) => index % step === 0);

    const lastCoord = coords[coords.length - 1];
    if (sampledCoords[sampledCoords.length - 1] !== lastCoord) {
      sampledCoords.push(lastCoord);
    }

    const elevations = sampledCoords
      .map((c) => c[2])
      .filter((e) => !isNaN(e) && e != null);

    if (elevations.length === 0) return defaultResult;

    const minElevation = Math.min(...elevations);
    const maxElevation = Math.max(...elevations);
    const elevationRange = maxElevation - minElevation;

    const yAxisOffset = Math.floor(
      Math.max(
        0,
        minElevation - elevationRange * CHART_CONFIG.layout.yAxisBuffer.bottom,
      ),
    );
    const maxValue = Math.ceil(
      maxElevation + elevationRange * CHART_CONFIG.layout.yAxisBuffer.top,
    );

    const spacing = chartWidth / sampledCoords.length;

    const elevationData = sampledCoords.map((coord, idx) => {
      const distance = (
        (idx / (sampledCoords.length - 1)) *
        totalDistanceKm
      ).toFixed(1);

      const labelFrequency = Math.ceil(sampledCoords.length / 4);
      const showLabel =
        idx === 0 ||
        idx === sampledCoords.length - 1 ||
        idx % labelFrequency === 0;

      return {
        value: coord[2] || 0,
        label: showLabel ? `${distance} km` : "",
        labelTextStyle: {
          color: CHART_CONFIG.colors.text,
          width: 40,
          marginLeft: -20,
          textAlign: "center" as const,
          fontSize: 10,
        },
      };
    });

    return {
      elevationData,
      yAxisOffset,
      maxValue,
      spacing,
      totalDistanceKm,
      hasData: true,
    };
  }, [trail, chartWidth]);
};

const Charts = ({ trail }: ElevationDataProps) => {
  const screenWidth = Dimensions.get("window").width;

  const chartWidth = screenWidth - 48;

  const {
    elevationData,
    yAxisOffset,
    maxValue,
    spacing,
    totalDistanceKm,
    hasData,
  } = useChartData(trail, chartWidth);

  if (!hasData) {
    return (
      <View className="w-full h-64 items-center justify-center">
        <Text className="text-white/70">Brak danych o wysokości</Text>
      </View>
    );
  }

  return (
    <View className="w-full items-center">
      <Text className="text-white text-lg mb-4 font-semibold">
        Profil wysokościowy
      </Text>
      <View
        style={{
          overflow: "hidden",
          marginRight: 15,
          marginVertical: -10,
          marginLeft: 20,
        }}
      >
        <LineChart
          data={elevationData}
          yAxisOffset={yAxisOffset}
          maxValue={maxValue}
          height={CHART_CONFIG.layout.height}
          width={chartWidth}
          spacing={spacing}
          initialSpacing={10}
          areaChart
          curved
          thickness={2}
          color={CHART_CONFIG.colors.primary}
          startFillColor={CHART_CONFIG.colors.gradientStart}
          endFillColor={CHART_CONFIG.colors.gradientEnd}
          startOpacity={0.4}
          endOpacity={0.1}
          hideDataPoints={true}
          xAxisColor={CHART_CONFIG.colors.axis}
          yAxisColor={CHART_CONFIG.colors.axis}
          rulesColor={CHART_CONFIG.colors.axis}
          rulesType="solid"
          yAxisTextStyle={{
            color: CHART_CONFIG.colors.textMuted,
            fontSize: 10,
          }}
          noOfSections={5}
          xAxisIndicesWidth={2}
        />
      </View>

      <Text className="text-white/50 text-xs mt-6 text-center">
        Dystans całkowity: {totalDistanceKm.toFixed(2)} km
      </Text>
    </View>
  );
};

export default Charts;
