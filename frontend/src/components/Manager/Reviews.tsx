import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTrash } from "@fortawesome/free-solid-svg-icons";
import reviewService from "../../services/review.service";
import AuthContext from "../../store/auth-context";
import useGetUsers from "../../hooks/user/useGetUser";
import { Review } from "../../assets/Data";
import { formatDate } from "../../utils/format";

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const { getUserByEmail, usersData } = useGetUsers();

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
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto mt-8 px-4">
      {isLoading ? (
        <div className="text-white text-center w-full bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-8 border border-white/20">
          <p className="text-lg font-lora font-medium text-white/80">
            Ładowanie recenzji...
          </p>
        </div>
      )  : reviews.length === 0 ? (
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
            className="flex flex-col bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-6 mt-6 border border-white/20 hover:bg-white/15 transition-all duration-300 ease-in-out w-full"
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
                  if (typeof review.id === "number") {
                    handleDeleteReview(review.id);
                  }
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
    </div>
  );
};

export default Reviews;