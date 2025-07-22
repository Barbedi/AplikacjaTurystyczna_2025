import { AxiosResponse } from "axios";
import http from "../http-common";

class FilesService {
  upload = (file: File) =>
    new Promise<AxiosResponse>((resolve, reject) => {
      const form = new FormData();
      form.append("file", file);
      http
        .post("/files/uploadProfile", form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });

  uploadPeakImage = (file: File) =>
    new Promise<AxiosResponse>((resolve, reject) => {
      const form = new FormData();
      form.append("file", file);
      http
        .post("/files/upload/peaks", form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });

  uploadTrailImage = (file: File) =>
    new Promise<AxiosResponse>((resolve, reject) => {
      const form = new FormData();
      form.append("file", file);
      http
        .post("/files/upload/trails", form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });

  getImgUrl = (path: string) => {
    return `${http.defaults.baseURL}files/${path}`;
  };

  getPeakImgUrl = (path: string) => {
    return `${http.defaults.baseURL}files/peaks/${path}`;
  };

  getTrailImgUrl = (path: string) => {
    return `${http.defaults.baseURL}files/trails/${path}`;
  };
}

export default new FilesService();
