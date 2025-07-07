import { AxiosResponse } from "axios";
import http from "../http-common";

class FilesService {
  upload = (file: File) =>
    new Promise<AxiosResponse>((resolve, reject) => {
      const form = new FormData();
      form.append("file", file);
      http
        .post(
          "/files/upload/",
          { file },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        )
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
}

export default new FilesService();