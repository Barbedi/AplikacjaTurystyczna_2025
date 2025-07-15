import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Trails } from "../../assets/Data";
import trailsService from "../../services/trails.service";
import MapTrails from "../../components/Manager/MapTrails";
import ElevationProfile from "../../components/Manager/ElevationProfile";

const emptyTrail: Trails = {
  id: 0,
  name: "",
  description: "",
  difficulty: "",
  length_km: 0,
  elevation_gain: 0,
  region: "",
  route_type: "one-way",
  geometry: {
    type: "LineString",
    coordinates: [],
  },
  created_by: "",
  created_at: new Date().toISOString(),
  duration_minutes: 0,
};

const EditTrailPage = () => {
  const [trail, setTrail] = useState<Trails>(emptyTrail);
  const [hoverPoint, setHoverPoint] = useState<[number, number] | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) {
      console.error("ID is not provided");
      return;
    }

    trailsService
      .getTrailById(parseInt(id))
      .then((response) => {
        setTrail(response.data);
      })
      .catch((error) => {
        console.error("Error fetching trail data:", error);
      });
  }, [id]);

  return (
    <div className="flex flex-col max-w-6xl text-center items-center justify-center w-full mx-auto mt-3 gap-y-4">
      <div className="text-3xl font-bold text-white mb-4">{trail.name}</div>
      <div className="flex flex-row items-start justify-center w-full max-w-6xl">
        <div className="flex flex-col items-start justify-start w-1/2 p-4">
          <span className="text-lg font-lora text-white mb-2">
            Region: {trail.region}
          </span>
          <span className="text-lg font-lora text-white mb-2">
            Długość: {trail.length_km} km
          </span>
          <span className="text-lg font-lora text-white mb-2">
           Czas przejścia: {Math.floor(trail.duration_minutes as number / 60)} h {trail.duration_minutes as number% 60} min
          </span>
          <span className="text-lg font-lora text-white mb-2">
            Przewyższenie: {trail.elevation_gain} m
          </span>
          <span className="text-lg font-lora text-white mb-2">
            Typ trasy: {trail.route_type}
          </span>
          <span className="text-lg font-lora text-white mb-2">
            Data utworzenia: {new Date(trail.created_at).toLocaleDateString()}
          </span>
          {trail.geometry.coordinates.length > 0 && (
            <ElevationProfile
              route={{
                type: "FeatureCollection",
                features: [{
                  type: "Feature",
                  geometry: {
                    coordinates: [trail.geometry.coordinates] as number[][][]
                  },
                  properties: {
                    id: trail.id.toString(),
                    summary: {
                      distance: trail.length_km * 1000,
                      duration: 0
                    },
                    segments: [],
                    elevation: trail.geometry.coordinates.map(coord => coord[2] || 0)
                  }
                }]
              }}
              onHoverPoint={(hoverLat, hoverLng) => {
                if (!isNaN(hoverLat) && !isNaN(hoverLng)) {
                  setHoverPoint([hoverLat, hoverLng]);
                } else {
                  setHoverPoint(null);
                }
              }}
            />
          )}
        </div>
        <div className="flex flex-col items-start justify-start w-1/2 p-4">
          <div className="w-full h-96 border border-gray-300 rounded-lg overflow-hidden">
            <MapTrails trail={trail} hoverPoint={hoverPoint} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTrailPage;
