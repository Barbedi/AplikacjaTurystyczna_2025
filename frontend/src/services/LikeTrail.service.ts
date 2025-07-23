import http from "../http-common";

const likeTrailService = {
  likeTrail: async (sharedTrailId: number) => {
    return http.post(`/like-trail/${sharedTrailId}`);
  },

  unlikeTrail: async (sharedTrailId: number) => {
    return http.delete(`/like-trail/${sharedTrailId}`);
  },

  getLikesInfo: async (sharedTrailId: number) => {
    return http.get(`/like-trail/${sharedTrailId}`, { withCredentials: true });
  },
};

export default likeTrailService;
