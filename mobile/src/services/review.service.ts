import { api } from "../config/api";
import { Review } from "../types";

class ReviewService {
  getAllReviews() {
    return api.get("/reviews");
  }
  getReviewByUserId(userId: number) {
    return api.get(`/reviews/${userId}`);
  }
  getReviewForTrail(trailId: number) {
    return api.get(`/reviews/trail/${trailId}`);
  }
  createReview(data: Review) {
    return api.post("/reviews", data);
  }

  deleteReview(id: number) {
    return api.delete(`/reviews/${id}`);
  }
}

export default new ReviewService();
