import httpCommon from "../http-common";

class UserPeaksService {
  getUserPeaks = (userId: number, page: number = 1) => {
    return httpCommon.get(`/peaks/users/${userId}?page=${page}`);
  };
  addPeakUsers = (
    peakId: number,
    userId: number,
    description: string,
    photo_url: string,
  ) => {
    return httpCommon.post(`/peaks/${peakId}/users`, {
      user_id: userId,
      description,
      photo_url,
    });
  };
  getUserPeakById = (userId: number, peakId: number) => {
    return httpCommon.get(`/peaks/${peakId}/users/${userId}`);
  };
  updateUserPeakPhoto = async (
    userId: number,
    peakId: number,
    photoUrl: string,
  ) => {
    return httpCommon.patch(`/user-peaks/${userId}/${peakId}/photo`, {
      photoUrl,
    });
  };
  updateUserPeakVerification = async (
    userId: number,
    peakId: number,
    verified: boolean,
  ) => {
    return httpCommon.patch(`/user-peaks/${userId}/${peakId}/verification`, {
      verified,
    });
  };
}

export default new UserPeaksService();
