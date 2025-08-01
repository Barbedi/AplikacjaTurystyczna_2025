import { Filter, Sort,Users } from "../assets/Data";
import http from "../http-common";

class UsersService {
  getAll = (
    page: number = 1,
    limit?: number,
    filter?: Filter[],
    sort?: Sort,
  ) => {
    const params = new URLSearchParams();

    params.append("page", page.toString());

    if (limit) {
      params.append("limit", limit.toString());
    }

    if (filter && Array.isArray(filter)) {
      // Walidacja filtrów
      filter.forEach((f) => {
        if (!f.by || f.value === undefined || f.value === null) {
          throw new Error("Invalid filter");
        }
      });
      params.append("filter", JSON.stringify(filter));
    }

    if (sort) {
      if (!sort.by) {
        throw new Error("Invalid sort");
      }
      params.append("sort", JSON.stringify(sort));
    }

    const url = `/users?${params.toString()}`;

    return http.get(url, { withCredentials: true });
  };

  getById = (id: number) => {
    if (!id) throw new Error("ID is required");

    const filter = JSON.stringify([{ by: "id", value: id.toString() }]);

    return http.get(`/users?filter=${encodeURIComponent(filter)}`, {
      withCredentials: true,
    });
  };

  getByEmail = (email: string) => {
    if (!email) throw new Error("Email is required");

    const filter = JSON.stringify([{ by: "email", value: email }]);

    return http.get(`/users?filter=${encodeURIComponent(filter)}`, {
      withCredentials: true,
    });
  };

  update = (id: number, data: Users) => {
    if (!id || !data) throw new Error("ID and data are required");

    return http.patch(`/users/${id}`, data, { withCredentials: true });
  };

  updateImg = (id: number, img: string) => {
    if (!id || !img) throw new Error("ID and image are required");

    return http.patch(`/users/${id}/img`, { img }, { withCredentials: true });
  };

  delete = (id: number) => {
    if (!id) throw new Error("ID is required");

    return http.delete(`/users/${id}`, { withCredentials: true });
  };
}

export default new UsersService();
