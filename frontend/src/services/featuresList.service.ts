import http from "../http-common";

class FeaturesListService {
  getAll() {
    return http.get("/features-list");
  }

  getById(id: string) {
    return http.get(`/features-list/${id}`);
  }

  updateTrailFeatures(trailId: number, featureIds: number[]) {
    return http.post(`/features-list/${trailId}/update`, { featureIds });
  }
}

export default new FeaturesListService();
