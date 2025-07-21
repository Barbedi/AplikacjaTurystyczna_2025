import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import { ExtendedTrail } from "../../assets/Data";
import trailsService from "../../services/trails.service";
import MapTrails from "../../components/Manager/MapTrails";
import ElevationProfile from "../../components/Manager/ElevationProfile";
import filesService from "../../services/files.service";

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

const EditTrailPage = () => {
  const [trail, setTrail] = useState<ExtendedTrail>(emptyTrail);
  const [hoverPoint, ] = useState<[number, number] | null>(null);
  const { id } = useParams<{ id: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const AddImg = useCallback(async (id: number, img: string) => {
    try {
      const response = await trailsService.updateTrailPhotos(id, [
        {
          image_name: img,
          created_at: new Date().toISOString(),
        },
      ]);
      if (response.status === 200) {
        return response.data.message;
      }
    } catch (error) {
      console.error("Error updating trail image:", error);
    }
  }, []);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || !trail.id) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error("Plik jest zbyt duży. Maksymalny rozmiar to 5MB.");
      return;
    }
  
    try {
      const response = await filesService.uploadTrailImage(file);
      const filename = response.data.file?.filename;
  
      if (!filename) throw new Error("Brak nazwy pliku w odpowiedzi");
      
      await AddImg(trail.id, filename);
      
      // Refresh trail data to show the new image
      trailsService
        .getTrailById(trail.id)
        .then((response) => {
          setTrail(response.data);
        })
        .catch((error) => {
          console.error("Error refreshing trail data:", error);
        });
        
    } catch (err) {
      console.error("Błąd podczas przesyłania pliku:", err);
    }
  };

  return (
    <div className="flex flex-col max-w-6xl text-center items-center justify-center w-full mx-auto mt-3 gap-y-4">
      <div className="text-3xl font-bold text-white mb-4 underline">
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
           <div className="w-full p-4">
          {/**dodanie zdjecia */}
          <div className="w-full bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20 mt-4">
            <h3 className="text-xl font-lora text-white mb-3 border-b border-white/20 pb-2">
              Zdjęcia trasy
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trail.photos && trail.photos.length > 0 ? (
                trail.photos.map((photo) => (
                  <img
                    key={photo.id}
                    src={filesService.getTrailImgUrl(photo.image_name)}
                    alt={`Zdjęcie trasy ${trail.name}`}
                    className="w-full h-auto rounded-lg"
                  />
                ))
              ) : (
                <p className="text-white">Brak zdjęć do wyświetlenia</p>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
              >
                <span>Dodaj nowe zdjęcie</span>
              </button>
            </div>
            </div>
          </div>

      </div>
        </div>
       
    </div>
  );
};

export default EditTrailPage;
