import { api } from "../config/api";

class FavouriteTrailsService {
  getFavouriteTrails = () => {
    return api.get(`/favourite-trails`, { withCredentials: true });
  };

  addFavouriteTrail = (trailId: number) => {
    return api.post(
      `/favourite-trails`,
      { trail_id: trailId },
      { withCredentials: true },
    );
  };

  removeFavouriteTrail = (trailId: number) => {
    return api.delete(`/favourite-trails/${trailId}`, {
      withCredentials: true,
    });
  };
}

export default new FavouriteTrailsService();
