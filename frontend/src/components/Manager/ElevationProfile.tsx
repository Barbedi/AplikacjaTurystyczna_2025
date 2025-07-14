import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
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

  const { coords, elevationData, totalDistanceKm } = useMemo(() => {
    if (!route || !route.features || route.features.length === 0) {
      return { coords: [], elevationData: [], totalDistanceKm: 0 };
    }

    const coordsRaw = route.features[0].geometry.coordinates;
    const coords = (
      Array.isArray(coordsRaw[0][0]) ? coordsRaw[0] : coordsRaw
    ) as [number, number, number][];
    const totalDistanceKm = parseFloat(
      (route.features[0].properties.summary.distance / 1000).toFixed(2),
    );

    const elevationData = coords.map(
      (coord: [number, number, number], idx: number) => ({
        distance: parseFloat(
          ((idx / (coords.length - 1)) * totalDistanceKm).toFixed(2),
        ),
        elevation: coord[2],
      }),
    );

    return { coords, elevationData, totalDistanceKm };
  }, [route]);

  const handleMouseMove = useCallback(
    (state: { activeTooltipIndex?: number | string | null }) => {
      if (state && state.activeTooltipIndex != null && onHoverPoint) {
        const index = state.activeTooltipIndex as number;

        if (lastIndex.current !== index) {
          lastIndex.current = index;
          const coord = coords[index];
          if (coord && Array.isArray(coord)) {
            const lng = coord[0];
            const lat = coord[1];
            onHoverPoint(lat, lng);
          }
        }
      }
    },
    [coords, onHoverPoint],
  );

  const handleMouseLeave = useCallback(() => {
    lastIndex.current = -1;
    if (onHoverPoint) onHoverPoint(NaN, NaN);
  }, [onHoverPoint]);

  if (!route || !route.features || route.features.length === 0) return null;

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={elevationData}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          margin={{ top: 10, bottom: 10, left: 0, right: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="distance"
            type="number"
            domain={[0, totalDistanceKm]}
            tickFormatter={(value) => `${value} km`}
            name="Dystans"
          />
          <YAxis
            dataKey="elevation"
            type="number"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(value) => `${value} m`}
            name="Wysokość"
          />
          <Tooltip
            formatter={(value: number) => `${value} m`}
            labelFormatter={(label: number) => `Dystans: ${label} km`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="elevation"
            stroke="#9333ea"
            strokeWidth={2}
            dot={false}
            name="Wysokość"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ElevationProfile;
