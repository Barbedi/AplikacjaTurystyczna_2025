import httpCommon from "../http-common";

class FavouriteTrailsService {
  getFavouriteTrails = () => {
    return httpCommon.get(`/favourite-trails`, { withCredentials: true });
  };

  addFavouriteTrail = (trailId: number) => {
    return httpCommon.post(
      `/favourite-trails`,
      { trail_id: trailId },
      { withCredentials: true },
    );
  };

  removeFavouriteTrail = (trailId: number) => {
    return httpCommon.delete(`/favourite-trails/${trailId}`, {
      withCredentials: true,
    });
  };
}

export default new FavouriteTrailsService();
