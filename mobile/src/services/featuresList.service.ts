import { api } from "../config/api";

class FeaturesListService {
  getAll() {
    return api.get("/features-list");
  }

  getById(id: string) {
    return api.get(`/features-list/${id}`);
  }

  updateTrailFeatures(trailId: number, featureIds: number[]) {
    return api.post(`/features-list/${trailId}/update`, { featureIds });
  }
}

export default new FeaturesListService();
