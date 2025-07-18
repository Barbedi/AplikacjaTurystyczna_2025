import httpCommon from "../http-common";

class UserPeaksService {
  getUserPeaks = (userId: number, page: number = 1) => {
    return httpCommon.get(`/peaks/users/${userId}?page=${page}`);
  };
  addPeakUsers = (peakId: number, userId: number, description: string, photo_url: string) => {
    return httpCommon.post(`/peaks/${peakId}/users`, { user_id: userId, description, photo_url });
  };
  getUserPeakById = (userId: number, peakId: number) => {
    return httpCommon.get(`/peaks/${peakId}/users/${userId}`);
  };

}

export default new UserPeaksService();
