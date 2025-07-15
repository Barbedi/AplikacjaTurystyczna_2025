import http from "../http-common";
import { Trails, NewTrail, TrailsResponse } from "../assets/Data";

class TrailsService {
  getTrails = () => {
    return http.get<Trails[]>("/trails", { withCredentials: true });
  };

  getTrailById = (id: number) => {
    return http.get<Trails>(`/trails/${id}`, { withCredentials: true });
  };

  getTrailsByUser = (userId: string, page: number = 1) => {
    return http.get<TrailsResponse>(`/trails/user/${userId}?page=${page}`, { withCredentials: true });
  };

  createTrail = (trail: NewTrail) => {
    return http.post("/trails", trail, { withCredentials: true });
  };

  updateTrail = (id: number, trail: Trails) => {
    return http.patch(`/trails/${id}`, trail, { withCredentials: true });
  };

  deleteTrail = (id: number) => {
    return http.delete(`/trails/${id}`, { withCredentials: true });
  };
}

export default new TrailsService();
