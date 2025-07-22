import http from "../http-common";
import { Trails, NewTrail, TrailsResponse, RoutePoint } from "../assets/Data";

class TrailsService {
  getTrails = () => {
    return http.get<Trails[]>("/trails", { withCredentials: true });
  };

  getTrailsByPublic = (page: number = 1) => {
    return http.get<TrailsResponse>(`/trails?page=${page}`, {
      withCredentials: true,
    });
  };

  getRandomTrails = (limit: number = 3) => {
    return http.get<Trails[]>(`/trails/random?limit=${limit}`, {
      withCredentials: true,
    });
  };
  getTrailById = (id: number) => {
    return http.get<Trails>(`/trails/${id}`, { withCredentials: true });
  };

  getTrailsByUser = (userId: string, page: number = 1) => {
    return http.get<TrailsResponse>(`/trails/user/${userId}?page=${page}`, {
      withCredentials: true,
    });
  };

  createTrail = (trail: NewTrail & { points?: RoutePoint[] }) => {
    return http.post("/trails", trail, { withCredentials: true });
  };

  updateTrail = (
    id: number,
    trail: Partial<Omit<Trails, "points">> & { points?: RoutePoint[] },
  ) => {
    return http.patch(`/trails/${id}`, trail, { withCredentials: true });
  };

  updateTrailPhotos = (
    id: number,
    photos: { image_name: string; created_at: string }[],
  ) => {
    return http.patch(`/trails/${id}/photos`, photos, {
      withCredentials: true,
    });
  };

  deleteTrail = (id: number) => {
    return http.delete(`/trails/${id}`, { withCredentials: true });
  };
  deleteTrailPhoto = (id: number, photoName: string) => {
    return http.delete(`/trails/${id}/photos/${photoName}`, {
      withCredentials: true,
    });
  };
}

export default new TrailsService();
