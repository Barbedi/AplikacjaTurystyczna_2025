import { useParams } from "react-router-dom";
import { useState, useEffect, useContext, useCallback } from "react";
import { ExtendedTrail, Review } from "../../assets/Data";
import trailsService from "../../services/trails.service";
import MapTrails from "../../components/Manager/Map/MapTrails";
import communitytrailsService from "../../services/communitytrails.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import reviewService from "../../services/review.service";
import {
  faMountain,
  faPersonHiking,
  faMap,
  faImage,
  faFireFlameCurved,
  faShare,
  faComment,
  faStar,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "../../components/Modal";
import useGetUsers from "../../hooks/user/useGetUser";
import AuthContext from "../../store/auth-context";
import ElevationSection from "../../components/Manager/Trail/ElevationSection";
import GallerySection from "../../components/Manager/Trail/GallerySection";
import ReviewSection from "../../components/Manager/Trail/ReviewSection";
import TrailInfoSection from "../../components/Manager/Trail/TrailInfoSection";

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
  features: [],
};

const EditTrailPage = () => {
  const [trail, setTrail] = useState<ExtendedTrail>(emptyTrail);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState<
    "info" | "photos" | "map" | "comments"
  >("map");
  const [openModal, setOpenModal] = useState(false);
  const [openModalComment, setOpenModalComment] = useState(false);
  const [description, setDescription] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const { user } = useContext(AuthContext);
  const { getUserByEmail, usersData } = useGetUsers();
  const { id } = useParams<{ id: string }>();

  const currentUser = usersData?.[0][0];
  const descriptionInputHandler = (
    ev: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setDescription(ev.target.value);
  };

  useEffect(() => {
    const trailIdentifier = id;

    if (!trailIdentifier) {
      console.error("Brak identyfikatora trasy");
      return;
    }
    const fetchData = async () => {
      try {
        const trailResponse = await trailsService.getTrailById(
          parseInt(trailIdentifier),
        );
        setTrail(trailResponse.data);
        const reviewsResponse = await reviewService.getReviewForTrail(
          parseInt(trailIdentifier),
        );
        setReviews(reviewsResponse.data.data || []);
      } catch (error) {
        console.error("Błąd pobierania danych:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleShareTrail = async () => {
    if (!description.trim()) {
      alert("Wypełnij wszystkie pola!");
      return;
    }
    try {
      const response = await communitytrailsService.addCommunityTrail(
        trail.id,
        description,
      );
      if (response.status === 201) {
        setOpenModal(false);
        setDescription("");
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

  const handleAddReview = async () => {
    if (!currentUser?.id || !id || !reviewText.trim() || rating === 0) {
      alert("Wypełnij wszystkie pola!");
      return;
    }
    try {
      const review: Review = {
        user_id: currentUser.id,
        trail_id: parseInt(id),
        comment: reviewText,
        rating: rating > 0 ? rating : undefined,
      };
      const response = await reviewService.createReview(review);
      if (response.status === 201) {
        setOpenModalComment(false);
        setReviewText("");
      }
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const handleStarClick = (starNumber: number) => {
    setRating(starNumber);
  };

  const handleStarHover = (starNumber: number) => {
    setHoveredStar(starNumber);
  };

  const handleStarLeave = () => {
    setHoveredStar(0);
  };

  const getAverageRating = useCallback(() => {
    if (reviews.length === 0) return null;
    const total = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

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
              className="absolute -top-3 right-6 text-white text-2xl cursor-pointer "
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
              <button
                className="bg-white/20 hover:bg-white/30 transition-colors text-white py-2 px-4 rounded-lg flex items-center"
                onClick={() => setActiveTab("comments")}
              >
                <FontAwesomeIcon icon={faComment} className="mr-1" />
                Komentarze
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
            <TrailInfoSection trail={trail} />
          </div>
          <div className="lg:col-span-2">
            {activeTab === "info" && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <ElevationSection trail={trail} />
              </div>
            )}
            {activeTab === "map" && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-lora text-white mb-4 border-b border-white/20 pb-2">
                  Mapa trasy
                </h3>
                <div className="h-[312px] w-full">
                 <MapTrails 
                   trail={trail} 
                   trailPoints={trail.points || []} 
                   hoverPoint={null} 
                 />
                </div>
              </div>
            )}
            {activeTab === "photos" && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <GallerySection
                  trail={trail}
                  onPhotosUpdated={(updatedTrail) => setTrail(updatedTrail)}
                />
              </div>
            )}
            {activeTab === "comments" && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <ReviewSection
                  reviews={reviews}
                  averageRating={getAverageRating()}
                />
              </div>
            )}
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
            className="w-full px-4 py-1 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faXmark} />
            Zamknij
          </button>
          <button
            className="px-4 py-1 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all w-full"
            onClick={() => handleShareTrail()}
          >
            Udostępnij
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={openModalComment}
        onClose={() => setOpenModalComment(false)}
      >
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
            onClick={() => setOpenModalComment(false)}
            className="w-full px-4 py-1 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faXmark} />
            <span>Zamknij</span>
          </button>
          <button
            onClick={handleAddReview}
            className="px-4 py-1 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all w-full shadow-xl cursor-pointer"
          >
            Oceń
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default EditTrailPage;
