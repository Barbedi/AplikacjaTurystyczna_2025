import httpCommon from "../http-common";   
import { Review } from "../assets/Data.d";




class ReviewService {
    getAllReviews() {
        return httpCommon.get("/reviews");
    }
   getReviewByUserId(userId: number) {
    return httpCommon.get(`/reviews/${userId}`);
    }

  createReview(data: Review) {
    return httpCommon.post("/reviews", data);
  }

  deleteReview(id: number) {
    return httpCommon.delete(`/reviews/${id}`);
  }
}

export default new ReviewService();