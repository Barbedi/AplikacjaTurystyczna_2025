import http from "../http-common";

class AuthenticationService {
  authenticate = (requiredRole?: string) => {
    if (requiredRole) {
      return http.get(`/authenticate/?requiredRole=${requiredRole}`, {
        withCredentials: true,
      });
    }

    return http.get("/authenticate", { withCredentials: true });
  };

  refreshToken = () => {
    return http.post("/authenticate/refresh", {}, { withCredentials: true });
  };

  logout = () => {
    return http.get("/logout", { withCredentials: true });
  };
}

export default new AuthenticationService();
