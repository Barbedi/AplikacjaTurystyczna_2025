import http from "../http-common";
import { Trails } from "../assets/Data";

// Typ dla nowej trasy bez ID i created_at
type NewTrail = Omit<Trails, "id" | "created_at">;

class TrailsService {
  getTrails = () => {
    return http.get<Trails[]>("/trails", { withCredentials: true });
  };

  getTrailById = (id: number) => {
    return http.get<Trails>(`/trails/${id}`, { withCredentials: true });
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
