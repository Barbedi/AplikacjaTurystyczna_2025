import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback, useRef, useContext } from "react";
import { ExtendedTrail,Review } from "../../assets/Data";
import trailsService from "../../services/trails.service";
import MapTrails from "../../components/Manager/Map/MapTrails";
import ElevationProfile from "../../components/Manager/ElevationProfile";
import filesService from "../../services/files.service";
import communitytrailsService from "../../services/communitytrails.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import reviewService from "../../services/review.service";
import {
  faMountain,
  faPersonHiking,
  faMap,
  faImage,
  faFireFlameCurved,
  faTrash,
  faShare,
  faComment,
  faStar,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "../../components/Modal";
import useGetUsers from "../../hooks/user/useGetUser";
import AuthContext from "../../store/auth-context";

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
  const [openModal, setOpenModal] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const { user } = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const { getUserByEmail, usersData } = useGetUsers();
  const [openModalComment, setOpenModalComment] = useState(false);
  const [trail, setTrail] = useState<ExtendedTrail>(emptyTrail);
  const [hoverPoint] = useState<[number, number] | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "photos" | "map">("map");
  const { id, trailId } = useParams<{ id: string; trailId: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [description, setDescription] = useState("");

  const descriptionInputHandler = (
    ev: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setDescription(ev.target.value);
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
  useEffect(() => {
    if (!trailId) {
      console.error("Trail ID is not provided");
      return;
    }

    trailsService
      .getTrailById(parseInt(trailId))
      .then((response) => {
        setTrail(response.data);
      })
      .catch((error) => {
        console.error("Error fetching trail data:", error);
      });
  }, [trailId]);

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

  const handleDeletePhoto = async (image_name: string) => {
    if (!id) return;
    try {
      await trailsService.deleteTrailPhoto(parseInt(id), image_name);
      setTrail((prev) => ({
        ...prev,
        photos:
          prev.photos?.filter((photo) => photo.image_name !== image_name) || [],
      }));
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  };

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

    setIsUploading(true);
    try {
      const response = await filesService.uploadTrailImage(file);
      const filename = response.data.file?.filename;

      if (!filename) throw new Error("Brak nazwy pliku w odpowiedzi");

      await AddImg(trail.id, filename);
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
    } finally {
      setIsUploading(false);
    }
  };

  const handleShareTrail = async () => {
    if (!id) return;
    try {
      const response = await communitytrailsService.addCommunityTrail(
        trail.id,
        description,
      );
      if (response.status === 201) {
        setOpenModal(false);
        console.log("Trail shared successfully:", response.data);
      }
    } catch (error) {
      console.error("Error sharing trail:", error);
    }
  };
useEffect(() => {
    if (user?.email) {
      getUserByEmail(user.email);
    }
  }, [user?.email, getUserByEmail]);

  const currentUser = usersData?.[0]?.[0];
   const handleStarClick = (starNumber: number) => {
    setRating(starNumber);
  };

  const handleStarHover = (starNumber: number) => {
    setHoveredStar(starNumber);
  };

  const handleStarLeave = () => {
    setHoveredStar(0);
  };
  const handleAddReview = async () => {
    if (!currentUser?.id || !id) return;
    try {
      const review: Review = {
        user_id: currentUser.id,
        trail_id: parseInt(id),
        comment: reviewText,
        rating: rating > 0 ? rating : undefined,
      };
      await reviewService.createReview(review);
      setOpenModal(false);
      setReviewText("");
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 w-full">
      <div className="relative bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6 overflow-hidden">
        <div className="relative z-10 p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <FontAwesomeIcon
              icon={faShare}
              title="Udostępnij trasę"
              className="absolute -top-3 -right-2 text-white text-2xl cursor-pointer"
              onClick={() => setOpenModal(true)}
            />
            <FontAwesomeIcon
              icon={faComment}
              title="Dodaj komentarz"
              className="absolute -top-3 right-6 text-white text-2xl cursor-pointer"
              onClick={() => setOpenModalComment(true)}
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
                  <FontAwesomeIcon icon={faFireFlameCurved} className="mr-1" />
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
                <h3 className="text-xl font-lora text-white">Galeria zdjęć</h3>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className={`${isUploading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"} transition-colors text-white font-medium py-2 px-4 rounded-lg flex items-center`}
                >
                  {isUploading ? (
                    <>
                      <span>Przesyłanie...</span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faImage} className="mr-2" />
                      <span>Dodaj zdjęcie</span>
                    </>
                  )}
                </button>
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
                            <button
                              className="text-white bg-red-600/80 hover:bg-red-700 p-1 rounded-full"
                              onClick={() =>
                                handleDeletePhoto(photo.image_name)
                              }
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
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
                    Brak zdjęć do wyświetlenia
                  </p>
                  <p className="text-sm text-white/50 mt-2 max-w-md text-center">
                    Kliknij przycisk "Dodaj zdjęcie" powyżej, aby dodać pierwsze
                    zdjęcie tej trasy.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <h2 className="text-white text-2xl font-semibold mb-4 text-center">
          Udostępnij trasę
        </h2>
        <span className="text-white/70 text-xl underline">{trail.name}</span>
        <textarea
          name="description"
          id="description"
          value={description}
          onChange={descriptionInputHandler}
          className="mt-2  w-full rounded-md bg-white/5 border border-white/20 focus:outline-none text-white p-3"
          placeholder="Dodaj opis trasy..."
        ></textarea>
        <div className="flex flex-row items-end gap-3 mt-6">
          <button
            onClick={() => setOpenModal(false)}
            className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all w-full"
          >
            Zamknij
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all w-full"
            onClick={() => handleShareTrail()}
          >
            Udostępnij
          </button>
        </div>
      </Modal>
      <Modal isOpen={openModalComment} onClose={() => setOpenModalComment(false)}>
  <h2 className="text-white text-2xl font-semibold mb-4 text-center">
    Dodaj komentarz
  </h2>
  <div className="w-full flex flex-col items-center">
    <div className="w-full mb-4">
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        rows={4}
        maxLength={500}
        required
        className="mt-2  w-full rounded-md bg-white/5 border border-white/20 focus:outline-none text-white p-3"
        placeholder="Podziel się swoimi wrażeniami ze szczytu..."
      />
    </div>
    <div className="flex gap-1 justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <FontAwesomeIcon
          key={star}
          icon={faStar}
          className={`text-2xl cursor-pointer transition-colors ${
            star <= (hoveredStar || rating)
              ? "text-yellow-400"
              : "text-white/30"
          } hover:text-yellow-300`}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => handleStarHover(star)}
          onMouseLeave={handleStarLeave}
        />
      ))}
    </div>
    <span className="mt-2 text-white font-lora">
      {rating > 0 ? `${rating}/5` : "Nie oceniono"}
    </span>
  </div>

  <div className="flex flex-row items-end gap-3 mt-6">
    <button
      onClick={() => setOpenModal(false)}
      className="w-full px-5 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer flex items-center justify-center gap-2"
    >
      <FontAwesomeIcon icon={faXmark} />
      <span>Zamknij</span>
    </button>
    <button
    onClick={handleAddReview}
      className="px-4 py-1 rounded-lg bg-purple-400/30  text-purple-400 hover:bg-purple-400/20 border border-purple-400/20 transition-all w-full cursor-pointer"
    >
      Oceń
    </button>
  </div>
</Modal>
    </div>
  );
};

export default EditTrailPage;
