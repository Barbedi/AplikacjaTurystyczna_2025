import ElevationProfile from "../ElevationProfile";
import { ExtendedTrail, RouteTrail } from "../../../assets/Data";
import { useMemo } from "react";

interface Props {
  trail: ExtendedTrail;
}

const ElevationSection = ({ trail }: Props) => {
  const routeData: RouteTrail = useMemo(() => {
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: trail.geometry.coordinates.map(
              (coord) =>
                [coord[0], coord[1], coord[2] || 0] as [number, number, number],
            ),
          },
          properties: {
            id: trail.id.toString(),
            distance: trail.length_km * 1000,
            nodes: trail.geometry.coordinates.length,
            summary: {
              distance: trail.length_km * 1000,
              duration: (trail.duration_minutes || 0) * 60,
            },
            segments: [],
            elevation: trail.geometry.coordinates.map((coord) => coord[2] || 0),
          },
        },
      ],
    };
  }, [trail]);

  return (
    <div className="">
      <h3 className="text-xl font-lora text-white mb-4 border-b border-white/20 pb-2">
        Profil wysokościowy
      </h3>
      {trail.geometry.coordinates.length > 0 ? (
        <div className="h-[336px]">
          <ElevationProfile route={routeData} />
        </div>
      ) : (
        <div className="flex items-center justify-center h-[200px] text-white/70">
          Brak danych wysokościowych dla tej trasy.
        </div>
      )}
    </div>
  );
};

export default ElevationSection;
