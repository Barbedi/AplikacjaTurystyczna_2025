import ElevationProfile from "../ElevationProfile";
import { ExtendedTrail } from "../../../assets/Data";

interface Props {
  trail: ExtendedTrail;
}

const ElevationSection = ({ trail }: Props) => {
  return (
    <div className="">
      <h3 className="text-xl font-lora text-white mb-4 border-b border-white/20 pb-2">
        Profil wysokościowy
      </h3>
      {trail.geometry.coordinates.length > 0 ? (
        <div className="h-[336px]">
          <ElevationProfile
            route={{
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: {
                    coordinates: [trail.geometry.coordinates] as number[][][],
                  },
                  properties: {
                    id: trail.id.toString(),
                    summary: {
                      distance: trail.length_km * 1000,
                      duration: 0,
                    },
                    segments: [],
                    elevation: trail.geometry.coordinates.map(
                      (coord) => coord[2] || 0,
                    ),
                  },
                },
              ],
            }}
          />
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
