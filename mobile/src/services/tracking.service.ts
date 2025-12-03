import { api } from "../config/api";

export const TrackingService = {
  createRoute: async (userId: number, name: string) => {
    console.log(`[TrackingService] createRoute: POST /tracking`, {
      user_id: userId,
      name,
    });
    const res = await api.post("/tracking", { user_id: userId, name });
    return res.data.route_id;
  },

  sendPoint: async (routeId: number, point: any) => {
    console.log(
      `[TrackingService] sendPoint: POST /tracking/${routeId}/point`,
      point,
    );
    await api.post(`/tracking/${routeId}/point`, point);
  },

  sendPoints: async (routeId: number, points: any[]) => {
    console.log(
      `[TrackingService] sendPoints: POST /tracking/${routeId}/points`,
      { count: points.length }
    );
    await api.post(`/tracking/${routeId}/points`, { points });
  },

  finishRoute: async (routeId: number) => {
    const res = await api.post(`/tracking/${routeId}/finish`);
    return res.data;
  },

  deleteRoute: async (routeId: number) => {
    console.log(`[TrackingService] deleteRoute: DELETE /tracking/${routeId}`);
    await api.delete(`/tracking/${routeId}`);
  },

  updateRoute: async (routeId: number, data: { name: string }) => {
    console.log(`[TrackingService] updateRoute: PUT /tracking/${routeId}`, data);
    await api.put(`/tracking/${routeId}`, data);
  },
};
