import { api } from "../config/api";
import type { Users } from "../types";

class RejestracjaService {
  create = (data: Users) => {
    return api.post("/register", data);
  };
}

export default new RejestracjaService();
