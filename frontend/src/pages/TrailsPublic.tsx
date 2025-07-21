import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Trails } from "../assets/Data";
import trailsService from "../services/trails.service";
import MapTrails from "../components/Manager/MapTrails";
import ElevationProfile from "../components/Manager/ElevationProfile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

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

const TrailsPublic =() => {
  const navigate = useNavigate();
  const [trail, setTrail] = useState<Trails>(emptyTrail);
  const [hoverPoint, ] = useState<[number, number] | null>(null);
  const { id } = useParams<{ id: string }>();
  const handleBackClick = () => {
    navigate(-1);
  };

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
    <div className="min-h-screen bg-linear-to-b from-grad1 to-grad2 pb-24 md:pb-0">
    <div className="flex flex-col max-w-6xl text-center items-center justify-center w-full mx-auto pt-3  gap-y-4">
      <div className="text-3xl font-bold text-white mb-4 underline">
         <FontAwesomeIcon
          icon={faCircleArrowLeft}
          className="text-white cursor-pointer absolute left-4 top-4 "
          title="Powrót"
          onClick={handleBackClick}
        />
        {trail.name}
      </div>
      <div className="flex flex-row items-start justify-center w-full max-w-6xl">
        <div className="flex flex-col items-start justify-start w-1/2 p-4">
          <div className="w-full  bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
            <h3 className="text-xl font-lora text-white mb-3 border-b border-white/20 pb-2">
              Informacje o trasie
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-white/70 font-medium w-1/4">Region:</span>
                <span className="text-white font-lora ml-5">
                  {trail.region}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-white/70 font-medium w-1/4">
                  Długość:
                </span>
                <span className="text-white font-lora ml-5">
                  {trail.length_km} km
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-white/70 font-medium w-1/4">
                  Czas przejścia:
                </span>
                <span className="text-white font-lora ml-5">
                  {Math.floor((trail.duration_minutes as number) / 60)} h{" "}
                  {(trail.duration_minutes as number) % 60} min
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-white/70 font-medium w-1/4">
                  Przewyższenie:
                </span>
                <span className="text-white font-lora ml-5">
                  {trail.elevation_gain} m
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-white/70 font-medium w-1/4">
                  Typ trasy:
                </span>
                <span className="text-white font-lora ml-5">
                  {trail.route_type}
                </span>
              </div>
              <div className=" flex items-center">
                <span className="text-white/70 font-medium w-1/4">
                  Data utworzenia:
                </span>
                <span className="text-white font-lora ml-5">
                  {new Date(trail.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="w-full  rounded-lg pt-4  ">
              <h3 className="text-xl block font-lora text-white mb-3 border-b border-white/20 pb-2">
                Wykres wysokości
              </h3>
              {trail.geometry.coordinates.length > 0 && (
                <ElevationProfile
                  route={{
                    type: "FeatureCollection",
                    features: [
                      {
                        type: "Feature",
                        geometry: {
                          coordinates: [
                            trail.geometry.coordinates,
                          ] as number[][][],
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
                  // onHoverPoint={(hoverLat, hoverLng) => {
                  //   if (!isNaN(hoverLat) && !isNaN(hoverLng)) {
                  //     setHoverPoint([hoverLat, hoverLng]);
                  //   } else {
                  //     setHoverPoint(null);
                  //   }
                  // }}
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start justify-start w-1/2 p-4">
          <div className="w-full mb-6 rounded-lg p-4 ">
            <h3 className="text-xl block font-lora text-white mb-3 pb-2">
              Lokalizacja
            </h3>
            <div className="w-full h-96 border  rounded-lg overflow-hidden border-white/20 shadow-lg">
              <MapTrails trail={trail} hoverPoint={hoverPoint} />
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};


export default TrailsPublic;