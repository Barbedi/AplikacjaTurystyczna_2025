import { api } from "../config/api";    
import { Statistics } from "../types";



class StatisticsService {
    async getStatisticsForUser(userId: number): Promise<Statistics> {
    const response = await api.get<Statistics>(`/statistics/${userId}`);
    return response.data;
  }

}

export default new StatisticsService();
