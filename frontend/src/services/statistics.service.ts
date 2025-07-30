import http from "../http-common"; // Adjust the import path as necessary
import type { Statistics } from "../assets/Data";

class StatisticsService {
  async getStatisticsForUser(userId: number): Promise<Statistics> {
    const response = await http.get<Statistics>(`/statistics/${userId}`);
    return response.data;
  }
}

export default new StatisticsService();
