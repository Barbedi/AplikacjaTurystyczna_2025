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

  updateVerification = (id: string, verified: boolean) => {
    return httpCommon.patch(`/peaks/${id}/verify`, {
      verified: verified,
    });
  };
  getCrownPoland = (page: number = 1) => {
    return httpCommon.get(`/peaks/crown-poland?page=${page}`);
  };
  getCrownBeskid = (page: number = 1) => {
    return httpCommon.get(`/peaks/crown-beskid?page=${page}`);
  };

  // Pobieranie zdjęć szczytu - może być implementowane w przyszłości
  getPeakImages = (id: string) => {
    return httpCommon.get(`/peaks/${id}/images`);
  };

  // Pobieranie wszystkich zdjęć dla szczytu
  getPeakPhotos = (id: string) => {
    return httpCommon.get(`/peaks/${id}/photos`);
  };

  // Weryfikacja zdjęcia szczytu przez GPS
  verifyPhoto = (filename: string, peak_id: number) => {
    return httpCommon.post("/peaks/verify-photo", {
      filename,
      peak_id,
    });
  };
}
export default new PeaksService();
