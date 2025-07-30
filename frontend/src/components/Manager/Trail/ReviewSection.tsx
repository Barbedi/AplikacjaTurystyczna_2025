import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Review } from "../../../assets/Data";
import { formatDate } from "../../../utils/format";

interface ReviewSectionProps {
  reviews: Review[];
  averageRating: string | null;
}

const ReviewSection = ({ reviews, averageRating }: ReviewSectionProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4 border-b border-white/20 pb-2">
        <h3 className="text-xl font-lora text-white">
          Komentarze użytkowników ({reviews.length})
        </h3>
        {averageRating && (
          <span className="text-yellow-400 text-lg font-normal">
            <FontAwesomeIcon icon={faStar} /> {averageRating}/5
          </span>
        )}
      </div>
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div>
                    <span className="text-white font-medium">
                      {review.user_name || "Anonimowy użytkownik"}
                    </span>
                    <p className="text-white/50 text-sm">
                      {formatDate(review.created_at || "")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FontAwesomeIcon
                      key={star}
                      icon={faStar}
                      className={`${
                        star <= (review.rating || 0)
                          ? "text-yellow-400"
                          : "text-white/20"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-white/80 mt-2">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white/60">Brak komentarzy dla tej trasy.</p>
      )}
    </div>
  );
};

export default ReviewSection;
