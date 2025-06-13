import type { Users } from "../assets/Data";
import http from "../http-common";

class RejestracjaService {
  create = (data: Users) => {
    return http.post("/register", data);
  };
}

export default new RejestracjaService();