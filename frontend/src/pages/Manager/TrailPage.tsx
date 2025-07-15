import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Trails } from "../../assets/Data";
import trailsService from "../../services/trails.service";
import MapTrails from "../../components/Manager/MapTrails";

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
};

const EditTrailPage = () => {
  const [trail, setTrail] = useState<Trails>(emptyTrail);
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
          <span className="text-lg font-lora text-white mb-2">Opis:</span>
          <p className="text-white mb-2">{trail.description}</p>
          <span className="text-lg font-lora text-white mb-2">
            Długość: {trail.length_km} km
          </span>
          <span className="text-lg font-lora text-white mb-2">
            Zysk wysokości: {trail.elevation_gain} m
          </span>
          <span className="text-lg font-lora text-white mb-2">
            Trudność: {trail.difficulty}
          </span>
          <span className="text-lg font-lora text-white mb-2">
            Typ trasy: {trail.route_type}
          </span>
          <span className="text-lg font-lora text-white mb-2">
            Data utworzenia: {new Date(trail.created_at).toLocaleDateString()}
          </span>
        </div>
        <div className="flex flex-col items-start justify-start w-1/2 p-4">
          <div className="w-full h-96 border border-gray-300 rounded-lg overflow-hidden">
            <MapTrails trail={trail} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTrailPage;
