import { api } from "@/src/config/api";

class TrackingRecordingService {

  // Pobiera wszystkie nagrania użytkownika
  getRoutesByUser = (userId: number) => {
    return api.get(`/gps/user/${userId}`);
  };

  // Pobiera pełną trasę z punktami
  getRouteById = (routeId: number) => {
    return api.get(`/gps/${routeId}`);
  };

  // Usuwa trasę (musi podać userId)
  deleteRoute = (routeId: number, userId: number) => {
    return api.delete(`/gps/${routeId}`, {
      params: { userId }
    });
  };

}

export default new TrackingRecordingService();
