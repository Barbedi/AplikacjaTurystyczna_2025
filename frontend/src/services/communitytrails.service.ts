import http from "../http-common";

class CommunityTrailsService {
  getCommunityTrails = () => {
    return http.get(`/community-trails`, { withCredentials: true });
  };

  getCommunityTrailDetails = (sharedTrailId: number) => {
    return http.get(`/community-trails/${sharedTrailId}`, {
      withCredentials: true,
    });
  };

  addCommunityTrail = (trailId: number, description: string) => {
    return http.post(
      `/community-trails`,
      { trailId, description },
      { withCredentials: true },
    );
  };

  updateCommunityTrail = (trailId: number) => {
    return http.put(`/community-trails/${trailId}`, { withCredentials: true });
  };

  deleteCommunityTrail = (trailId: number) => {
    return http.delete(`/community-trails/${trailId}`, {
      withCredentials: true,
    });
  };
}

export default new CommunityTrailsService();
