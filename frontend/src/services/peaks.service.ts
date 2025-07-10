import httpCommon from "../http-common";
import  { Peaks } from "../assets/Data";

class PeaksService {
  getAll = () => {
    return httpCommon.get("/peaks");
  };

  getById = (id: string) => {
    return httpCommon.get(`/peaks/${id}`);
  };

  update = (id: string, data:Peaks) => {
    return httpCommon.put(`/peaks/${id}`, data);
  };
  getCrownPoland = () => {
    return httpCommon.get("/peaks/crown-poland");
  };
  getCrownBeskid = () => {
    return httpCommon.get("/peaks/crown-beskid");
  };

}
export default new PeaksService();