import { api } from "../config/api";

class CommunityTrailsService {
  getCommunityTrails = () => {
    return api.get(`/community-trails`, { withCredentials: true });
  };

  getCommunityTrailDetails = (sharedTrailId: number) => {
    return api.get(`/community-trails/${sharedTrailId}`, {
      withCredentials: true,
    });
  };

  addCommunityTrail = (trailId: number, description: string) => {
    return api.post(
      `/community-trails`,
      { trailId, description },
      { withCredentials: true },
    );
  };

  updateCommunityTrail = (trailId: number) => {
    return api.put(`/community-trails/${trailId}`, { withCredentials: true });
  };

  deleteCommunityTrail = (trailId: number) => {
    return api.delete(`/community-trails/${trailId}`, {
      withCredentials: true,
    });
  };
}

export default new CommunityTrailsService();
