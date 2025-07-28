import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons"; // Dodaj faXmark
import reviewService from "../../../services/review.service";
import AuthContext from "../../../store/auth-context";
import useGetUsers from "../../../hooks/user/useGetUser";
import { Review } from "../../../assets/Data";
import { formatDate } from "../../../utils/format";
import Modal from "../../Modal";

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const { getUserByEmail, usersData } = useGetUsers();
  const [openModal, setOpenModal] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null); 

  useEffect(() => {
    if (user?.email) {
      getUserByEmail(user.email);
    }
  }, [user?.email, getUserByEmail]);

  const currentUser = usersData?.[0]?.[0];

  useEffect(() => {
    const fetchReviews = async () => {
      if (!currentUser?.id) return;
      setIsLoading(true);
      try {
        const response = await reviewService.getReviewByUserId(currentUser.id);
        setReviews(response.data.data || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [currentUser?.id]);

  const handleDeleteReview = async (reviewId: number) => {
    try {
      await reviewService.deleteReview(reviewId);
      setReviews(reviews.filter((review) => review.id !== reviewId));
      setOpenModal(false); 
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto  px-4">
      {isLoading ? (
        <div className="text-white text-center w-full bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-8 border border-white/20">
          <p className="text-lg font-lora font-medium text-white/80">
            Ładowanie recenzji...
          </p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-white text-center w-full bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-8 border border-white/20">
          <p className="text-lg font-lora font-medium text-white/80">
            Brak recenzji do wyświetlenia.
          </p>
          <p className="text-sm text-white/60 mt-2">
            Dodaj swoją pierwszą recenzję, aby podzielić się wrażeniami!
          </p>
        </div>
      ) : (
        reviews.map((review) => (
          <div
            key={review.id}
            className="flex flex-col bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-6 mt-2 border border-white/20 hover:bg-white/15 transition-all duration-300 ease-in-out w-full"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-lora font-semibold text-white tracking-tight">
                {review.peak_name ?? review.trail_name}
              </h3>
              <FontAwesomeIcon
                icon={faTrash}
                className="text-white/70 hover:text-red-400 text-lg cursor-pointer transition-colors duration-200"
                title="Usuń recenzję"
                onClick={() => {
                  setSelectedReviewId(review.id || null);
                  setOpenModal(true);
                }}
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-8 mt-4 text-white">
              <p className="text-sm text-white/70">
                <span className="font-medium">Data:</span>{" "}
                {formatDate(review.created_at || "")}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/70 font-medium">Ocena trasy:</span>
                <span className="text-white font-medium">{review.rating}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon
                      key={i}
                      icon={faStar}
                      className={`text-sm ${
                        i < (review.rating ?? 0) ? "text-yellow-400" : "text-white/30"
                      } transition-colors duration-200`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-white/70 font-medium mb-2">Komentarz:</p>
              <p className="text-white p-4 bg-white/5 rounded-lg leading-relaxed text-sm">
                {review.comment}
              </p>
            </div>
          </div>
        ))
      )}
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <h2 className="text-white text-2xl font-semibold mb-4 text-center">
          Czy chcesz usunąć recenzję?
        </h2>
        <p className="text-white/70 text-center">
          Ta akcja jest nieodwracalna. Po usunięciu recenzji nie będzie można jej odzyskać.
        </p>

        <div className="flex flex-row items-end gap-3 mt-6">
          <button
            onClick={() => setOpenModal(false)}
            className="w-full px-4 py-1 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faXmark} />
            <span>Anuluj</span>
          </button>
          <button
            onClick={() => {
              if (typeof selectedReviewId === "number") {
                handleDeleteReview(selectedReviewId);
              }
            }}
            className="px-4 py-1 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/20 transition-all w-full cursor-pointer"
          >
            Usuń
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Reviews;
