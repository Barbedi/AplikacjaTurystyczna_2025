import http from "../http-common";

interface Client {
  email: string;
  password: string;
}

class LogowanieService {
  create = (data: Client) => {
    return http.post("/login", data);
  };
  createPassword = (data: { email: string; password: string }) => {
    return http.post("/login/password", data);
  };
}
export default new LogowanieService();
