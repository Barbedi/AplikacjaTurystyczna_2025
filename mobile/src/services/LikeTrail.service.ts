import { api } from "../config/api";

const likeTrailService = {
  likeTrail: async (sharedTrailId: number) => {
    return api.post(`/like-trail/${sharedTrailId}`);
  },

  unlikeTrail: async (sharedTrailId: number) => {
    return api.delete(`/like-trail/${sharedTrailId}`);
  },

  getLikesInfo: async (sharedTrailId: number) => {
    return api.get(`/like-trail/${sharedTrailId}`, { withCredentials: true });
  },
};

export default likeTrailService;
