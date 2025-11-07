import { api } from "@/src/config/api";
import { Peaks } from "@/src/types";

class PeaksService {
  getAll = () => {
    return api.get("/peaks");
  };
  searchPeaks = (query: string) => {
    return api.get(`/peaks/search`, {
      params: {
        query,
      },
    });
  };

  getById = (id: string) => {
    return api.get(`/peaks/${id}`);
  };

  create = (data: Partial<Peaks>) => {
    return api.post("/peaks", data);
  };

  update = (id: string, data: Peaks) => {
    return api.put(`/peaks/${id}`, data);
  };

  updateImage = (id: string, imageFilename: string) => {
    return api.patch(`/peaks/${id}/image`, {
      image_filename: imageFilename,
    });
  };

  updateVerification = (id: string, verified: boolean) => {
    return api.patch(`/peaks/${id}/verify`, {
      verified: verified,
    });
  };
  getCrownPoland = (page: number = 1) => {
    return api.get(`/peaks/crown-poland?page=${page}`);
  };
  getCrownBeskid = (page: number = 1) => {
    return api.get(`/peaks/crown-beskid?page=${page}`);
  };

  // Pobieranie zdjęć szczytu - może być implementowane w przyszłości
  getPeakImages = (id: string) => {
    return api.get(`/peaks/${id}/images`);
  };

  // Pobieranie wszystkich zdjęć dla szczytu
  getPeakPhotos = (id: string) => {
    return api.get(`/peaks/${id}/photos`);
  };
}
export default new PeaksService();
