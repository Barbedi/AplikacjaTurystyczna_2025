import httpCommon from "../http-common";
import { Peaks } from "../assets/Data";

class PeaksService {
  getAll = () => {
    return httpCommon.get("/peaks");
  };
  searchPeaks = (query: string) => {
    return httpCommon.get(`/peaks/search`, {
      params: {
        query,
      },
    });
  };

  getById = (id: string) => {
    return httpCommon.get(`/peaks/${id}`);
  };

  create = (data: Partial<Peaks>) => {
    return httpCommon.post("/peaks", data);
  };

  update = (id: string, data: Peaks) => {
    return httpCommon.put(`/peaks/${id}`, data);
  };

  updateImage = (id: string, imageFilename: string) => {
    return httpCommon.patch(`/peaks/${id}/image`, {
      image_filename: imageFilename,
    });
  };
  getCrownPoland = (page: number = 1) => {
    return httpCommon.get(`/peaks/crown-poland?page=${page}`);
  };
  getCrownBeskid = (page: number = 1) => {
    return httpCommon.get(`/peaks/crown-beskid?page=${page}`);
  };
}
export default new PeaksService();
