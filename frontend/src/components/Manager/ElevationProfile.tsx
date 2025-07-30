import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { routeTrail } from "../../assets/Data";
import React, { useCallback, useRef, useMemo } from "react";

interface ElevationData {
  route: routeTrail | null;
  onHoverPoint?: (lat: number, lng: number) => void;
}

const ElevationProfile: React.FC<ElevationData> = ({ route, onHoverPoint }) => {
  const lastIndex = useRef(-1);

  const { coords, elevationData, totalDistanceKm, yDomain } = useMemo(() => {
    if (!route || !route.features || route.features.length === 0) {
      return {
        coords: [],
        elevationData: [],
        totalDistanceKm: 0,
        yDomain: [0, 100],
      };
    }

    const coordsRaw = route.features[0].geometry.coordinates;
    const coords = (
      Array.isArray(coordsRaw[0][0]) ? coordsRaw[0] : coordsRaw
    ) as [number, number, number][];

    const totalDistanceKm = parseFloat(
      (route.features[0].properties.summary.distance / 1000).toFixed(2),
    );
    const maxPoints = 500;
    const step =
      coords.length > maxPoints ? Math.ceil(coords.length / maxPoints) : 1;

    const sampledCoords = coords.filter((_, index) => index % step === 0);
    if (coords.length > 1 && (coords.length - 1) % step !== 0) {
      sampledCoords.push(coords[coords.length - 1]);
    }

    const elevationData = sampledCoords.map(
      (coord: [number, number, number], idx: number) => {
        const originalIndex = idx * step;
        return {
          distance: parseFloat(
            ((originalIndex / (coords.length - 1)) * totalDistanceKm).toFixed(
              2,
            ),
          ),
          elevation: coord[2],
          originalIndex,
        };
      },
    );

    const elevations = elevationData
      .map((d) => d.elevation)
      .filter((e) => !isNaN(e));
    const minElevation = Math.min(...elevations);
    const maxElevation = Math.max(...elevations);
    const margin = (maxElevation - minElevation) * 0.1;
    const yDomain = [Math.max(0, minElevation - margin), maxElevation + margin];

    return { coords, elevationData, totalDistanceKm, yDomain };
  }, [route]);

  const handleMouseMove = useCallback(
    (state: { activeTooltipIndex?: number | string | null }) => {
      if (
        state &&
        state.activeTooltipIndex != null &&
        onHoverPoint &&
        elevationData.length > 0
      ) {
        const index = state.activeTooltipIndex as number;

        if (
          lastIndex.current !== index &&
          index >= 0 &&
          index < elevationData.length
        ) {
          lastIndex.current = index;

          // Użyj oryginalnego indeksu z coords
          const dataPoint = elevationData[index];
          const originalIndex = dataPoint.originalIndex;

          if (originalIndex < coords.length) {
            const coord = coords[originalIndex];
            if (coord && Array.isArray(coord)) {
              const lng = coord[0];
              const lat = coord[1];
              onHoverPoint(lat, lng);
            }
          }
        }
      }
    },
    [coords, onHoverPoint, elevationData],
  );

  const handleMouseLeave = useCallback(() => {
    lastIndex.current = -1;
    if (onHoverPoint) onHoverPoint(NaN, NaN);
  }, [onHoverPoint]);

  const memoizedTooltip = useMemo(
    () => (
      <Tooltip
        formatter={(value: number) => [`${Math.round(value)} m`, "Wysokość"]}
        labelFormatter={(label: number) => `Dystans: ${label} km`}
        contentStyle={{
          backgroundColor: "rgba(0,0,0,0.8)",
          border: "1px solid rgba(255,255,255,0.3)",
          borderRadius: "8px",
          color: "white",
        }}
        animationDuration={100}
      />
    ),
    [],
  );

  const memoizedGrid = useMemo(
    () => (
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
    ),
    [],
  );

  const memoizedXAxis = useMemo(
    () => (
      <XAxis
        dataKey="distance"
        type="number"
        domain={[0, totalDistanceKm]}
        tickFormatter={(value) => `${value} km`}
        name="Dystans"
        tick={{ fill: "white", fontSize: 12 }}
        axisLine={{ stroke: "rgba(255,255,255,0.3)" }}
        tickLine={{ stroke: "rgba(255,255,255,0.3)" }}
      />
    ),
    [totalDistanceKm],
  );

  const memoizedYAxis = useMemo(
    () => (
      <YAxis
        dataKey="elevation"
        type="number"
        domain={yDomain}
        tickFormatter={(value) => `${Math.round(value)} m`}
        name="Wysokość"
        tick={{ fill: "white", fontSize: 12 }}
        axisLine={{ stroke: "rgba(255,255,255,0.3)" }}
        tickLine={{ stroke: "rgba(255,255,255,0.3)" }}
      />
    ),
    [yDomain],
  );

  const memoizedLine = useMemo(
    () => (
      <Line
        type="monotone"
        dataKey="elevation"
        stroke="#9333ea"
        strokeWidth={2}
        dot={false}
        name="Wysokość"
        activeDot={{ r: 6, fill: "#9333ea", strokeWidth: 2, stroke: "#ffffff" }}
        connectNulls={false}
        isAnimationActive={true}
      />
    ),
    [],
  );

  if (!route || !route.features || route.features.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-white/70">
        <p>Brak danych o wysokości</p>
      </div>
    );
  }

  if (elevationData.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-white/70">
        <p>Ładowanie profilu wysokości...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={elevationData}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          margin={{ top: 10, bottom: 20, left: 10, right: 10 }}
        >
          {memoizedGrid}
          {memoizedXAxis}
          {memoizedYAxis}
          {memoizedTooltip}
          {memoizedLine}
        </LineChart>
      </ResponsiveContainer>
      <div className="text-xs text-white/70 mt-1 text-center">
        {elevationData.length < coords.length && (
          <span>
            Pokazano {elevationData.length} z {coords.length} punktów
          </span>
        )}
      </div>
    </div>
  );
};

export default React.memo(ElevationProfile);
