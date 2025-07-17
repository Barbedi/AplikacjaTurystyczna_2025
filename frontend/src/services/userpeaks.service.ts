import httpCommon from "../http-common";

class UserPeaksService {
  getUserPeaks = (userId: number, page: number = 1) => {
    return httpCommon.get(`/peaks/users/${userId}?page=${page}`);
  };
  addPeakUsers = (peakId: number, userId: number) => {
    return httpCommon.post(`/peaks/${peakId}/users`, { user_id: userId });
  };
}

export default new UserPeaksService();
