import { api } from "../config/api";
import { Trails, NewTrail, TrailsResponse, RoutePoint } from "../types";

class TrailsService {
  getTrails = () => {
    return api.get<Trails[]>("/trails", { withCredentials: true });
  };

  getTrailsByPublic = (page: number = 1) => {
    return api.get<TrailsResponse>(`/trails?page=${page}`, {
      withCredentials: true,
    });
  };

  getRandomTrails = (limit: number = 3) => {
    return api.get<Trails[]>(`/trails/random?limit=${limit}`, {
      withCredentials: true,
    });
  };
  getTrailById = (id: number) => {
    return api.get<Trails>(`/trails/${id}`, { withCredentials: true });
  };

  getTrailsByUser = (userId: string, page: number = 1) => {
    return api.get<TrailsResponse>(`/trails/user/${userId}?page=${page}`, {
      withCredentials: true,
    });
  };

  createTrail = (trail: NewTrail & { points?: RoutePoint[] }) => {
    return api.post("/trails", trail, { withCredentials: true });
  };

  updateTrail = (
    id: number,
    trail: Partial<Omit<Trails, "points">> & { points?: RoutePoint[] },
  ) => {
    return api.patch(`/trails/${id}`, trail, { withCredentials: true });
  };

  updateTrailPhotos = (
    id: number,
    photos: { image_name: string; created_at: string }[],
  ) => {
    return api.patch(`/trails/${id}/photos`, photos, {
      withCredentials: true,
    });
  };

  gettrailByRegion = (region: string, page: number = 1) => {
    return api.get<TrailsResponse>(`/trails/region/${region}?page=${page}`, {
      withCredentials: true,
    });
  };

  deleteTrail = (id: number) => {
    return api.delete(`/trails/${id}`, { withCredentials: true });
  };
  deleteTrailPhoto = (id: number, photoName: string) => {
    return api.delete(`/trails/${id}/photos/${photoName}`, {
      withCredentials: true,
    });
  };
}

export default new TrailsService();
