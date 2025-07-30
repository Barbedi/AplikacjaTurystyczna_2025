import http from "../http-common";

class logsService {
  getUserActivities = async (userId: number, page: number) => {
    return http.get(`/user-activities/${userId}?page=${page}`, {
      withCredentials: true,
    });
  };
}

export default new logsService();
