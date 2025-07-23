import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { ExtendedTrail } from "../assets/Data";
import trailsService from "../services/trails.service";
import favouriteTrailsService from "../services/favouriteTrails.service";
import MapTrails from "../components/Manager/MapTrails";
import ElevationProfile from "../components/Manager/ElevationProfile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faHeart,
  faMountain,
  faFireFlameCurved,
  faPersonHiking,
  faImage,
  faMap,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import AuthContext from "../store/auth-context";
import filesService from "../services/files.service";

const emptyTrail: ExtendedTrail = {
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
  photos: [],
};

const TrailsPublic = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<"info" | "map" | "photos">("map");
  const navigate = useNavigate();
  const [trail, setTrail] = useState<ExtendedTrail>(emptyTrail);
  const [hoverPoint] = useState<[number, number] | null>(null);
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
  const handleFavoriteClick = async () => {
    if (!user) {
      alert("Musisz być zalogowany, aby dodać trasę do ulubionych.");
      return;
    }

    try {
      await favouriteTrailsService.addFavouriteTrail(trail.id);
      alert("Trasa została dodana do ulubionych!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert(
          "Nie jesteś zalogowany. Odśwież stronę lub zaloguj się ponownie.",
        );
      } else if (error.response?.status === 400) {
        //       alert("Ta trasa już jest w Twoich ulubionych.");
      } else {
        alert("Wystąpił błąd podczas dodawania trasy do ulubionych.");
      }
      console.error("Błąd:", error);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-grad1 to-grad2 pb-24 md:pb-0">
      <FontAwesomeIcon
        icon={faCircleArrowLeft}
        className="text-2xl text-white cursor-pointer hover:text-gray-300 absolute top-4 left-4"
        title="Wróć do poprzedniej strony"
        onClick={handleBackClick}
      />
      <div className="max-w-7xl mx-auto px-4 py-6 w-full">
        <div className="relative bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6 overflow-hidden">
          <div className="relative z-10 p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <FontAwesomeIcon
                icon={faHeart}
                className="ml-4 text-white cursor-pointer hover:text-red-500 absolute -top-3 -right-2 text-2xl"
                onClick={handleFavoriteClick}
              />
              <div>
                <h1 className="text-4xl font-bold text-white font-lora">
                  {trail.name}
                </h1>
                <div className="flex flex-wrap gap-3 mt-2">
                  <span className="bg-green-500/20 text-green-300 border border-green-500/30 text-sm py-1 px-3 rounded-full flex items-center">
                    <FontAwesomeIcon icon={faMountain} className="mr-1" />
                    {trail.region}
                  </span>
                  <span className="bg-red-600/20 text-red-300 border border-red-600/30 text-sm py-1 px-3 rounded-full flex items-center">
                    <FontAwesomeIcon
                      icon={faFireFlameCurved}
                      className="mr-1"
                    />
                    {trail.difficulty || "Średni"}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  className="bg-white/20 hover:bg-white/30 transition-colors text-white py-2 px-4 rounded-lg flex items-center"
                  onClick={() => setActiveTab("info")}
                >
                  <FontAwesomeIcon icon={faPersonHiking} className="mr-1" />
                  Wysokość
                </button>
                <button
                  className="bg-white/20 hover:bg-white/30 transition-colors text-white py-2 px-4 rounded-lg flex items-center"
                  onClick={() => setActiveTab("map")}
                >
                  <FontAwesomeIcon icon={faMap} className="mr-1" />
                  Mapa
                </button>
                <button
                  className="bg-white/20 hover:bg-white/30 transition-colors text-white py-2 px-4 rounded-lg flex items-center"
                  onClick={() => setActiveTab("photos")}
                >
                  <FontAwesomeIcon icon={faImage} className="mr-1" />
                  Galeria
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
              <div className="flex flex-col items-center p-3 rounded-lg bg-white/5">
                <span className="text-white/70 text-sm">Długość</span>
                <span className="text-white text-xl font-bold">
                  {trail.length_km} km
                </span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg bg-white/5">
                <span className="text-white/70 text-sm">Czas przejścia</span>
                <span className="text-white text-xl font-bold">
                  {Math.floor((trail.duration_minutes as number) / 60)} h{" "}
                  {(trail.duration_minutes as number) % 60} min
                </span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg bg-white/5">
                <span className="text-white/70 text-sm">Przewyższenie</span>
                <span className="text-white text-xl font-bold">
                  {trail.elevation_gain} m
                </span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg bg-white/5">
                <span className="text-white/70 text-sm">Typ trasy</span>
                <span className="text-white text-xl font-bold capitalize">
                  {trail.route_type}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
                <h3 className="text-xl font-lora text-white mb-4 border-b border-white/20 pb-2">
                  Informacje o trasie
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white/70 text-sm mb-1">Opis</h4>
                    <p className="text-white">
                      {trail.description || "Brak opisu trasy."}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-white/70 text-sm mb-1">Cechy</h4>
                    <p className="text-white">{"Brak cech trasy."}</p>
                  </div>
                  <div>
                    <h4 className="text-white/70 text-sm mb-1">Region</h4>
                    <p className="text-white font-medium">{trail.region}</p>
                  </div>
                  <div>
                    <h4 className="text-white/70 text-sm mb-1">Utworzono</h4>
                    <p className="text-white">
                      {new Date(trail.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div
                className={`${activeTab === "info" ? "block" : "hidden"} bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20`}
              >
                <h3 className="text-xl font-lora text-white mb-4 border-b border-white/20 pb-2">
                  Profil wysokościowy
                </h3>
                {trail.geometry.coordinates.length > 0 ? (
                  <div className="h-[312px]">
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
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[200px] text-white/70">
                    Brak danych wysokościowych dla tej trasy.
                  </div>
                )}
              </div>
              <div
                className={`${activeTab === "map" ? "block" : "hidden"} bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20`}
              >
                <h3 className="text-xl font-lora text-white mb-4 border-b border-white/20 pb-2">
                  Mapa trasy
                </h3>
                <div className="h-[312px] w-full">
                  <MapTrails trail={trail} hoverPoint={hoverPoint} />
                </div>
              </div>
              <div
                className={`${activeTab === "photos" ? "block" : "hidden"} bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20`}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-lora text-white">
                    Galeria zdjęć
                  </h3>
                </div>
                {trail.photos && trail.photos.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {trail.photos.map((photo) => (
                        <div
                          key={photo.id}
                          className="relative group overflow-hidden rounded-lg shadow-md"
                        >
                          <img
                            src={filesService.getTrailImgUrl(photo.image_name)}
                            alt={`Zdjęcie trasy ${trail.name}`}
                            className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-0 w-full p-3 flex justify-between items-center">
                              <span className="text-white text-sm">
                                {new Date(
                                  photo.created_at || "",
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-3 border-t border-white/20 flex justify-between items-center">
                      <span className="text-sm text-white/50">
                        Liczba zdjęć: {trail.photos.length}
                      </span>
                      <span className="text-xs text-white/50 italic">
                        Najedź kursorem, aby zobaczyć opcje
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-white/70 bg-white/5 rounded-lg">
                    <FontAwesomeIcon icon={faImage} className="text-4xl mb-4" />
                    <p className="text-xl text-white font-medium">
                      Brak zdjęć do wyświetlenia.
                    </p>
                    <p className="text-sm text-white/50 mt-2 max-w-md text-center">
                      Zaloguj sie aby dodac zdjecie
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailsPublic;
