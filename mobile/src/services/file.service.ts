import { api } from "@/src/config/api";

// Typ pliku – w Expo może to być np. obiekt z ImagePicker lub URI
export interface UploadableFile {
  uri: string;
  name?: string;
  type?: string;
}

class FilesService {
  /**
   * 🧩 Upload zdjęcia profilowego użytkownika
   */
  async uploadProfile(file: UploadableFile) {
    const formData = new FormData();

    formData.append("file", {
      uri: file.uri,
      name: file.name || "profile.jpg",
      type: file.type || "image/jpeg",
    } as any);

    return api.post("/files/uploadProfile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  /**
   * ⛰️ Upload zdjęcia szczytu (peaks)
   */
  async uploadPeakImage(file: UploadableFile) {
    const formData = new FormData();

    formData.append("file", {
      uri: file.uri,
      name: file.name || "peak.jpg",
      type: file.type || "image/jpeg",
    } as any);

    return api.post("/files/upload/peaks", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  /**
   * 🗺️ Upload zdjęcia szlaku (trails)
   */
  async uploadTrailImage(file: UploadableFile) {
    const formData = new FormData();

    formData.append("file", {
      uri: file.uri,
      name: file.name || "trail.jpg",
      type: file.type || "image/jpeg",
    } as any);

    return api.post("/files/upload/trails", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  /**
   * 📸 Generatory pełnych URL-i do zdjęć
   */
  getImgUrl = (path: string) => {
    const baseURL = api.defaults.baseURL?.replace(/\/$/, "") || "";
    return `${baseURL}/files/${path}`;
  };

  getPeakImgUrl = (path: string) => {
    const baseURL = api.defaults.baseURL?.replace(/\/$/, "") || "";
    return `${baseURL}/files/peaks/${path}`;
  };

  getTrailImgUrl = (path: string) => {
    const baseURL = api.defaults.baseURL?.replace(/\/$/, "") || "";
    return `${baseURL}/files/trails/${path}`;
  };
}

export default new FilesService();
