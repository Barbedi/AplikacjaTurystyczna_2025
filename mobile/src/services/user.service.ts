import { api } from "@/src/config/api"; // Twój axios wrapper z tokenami
import { Filter, Sort } from "@/src/types";

export interface User {
  id: number;
  email: string;
  role: string;
  name?: string;
  avatar?: string;
}

class UsersService {
  getAll = async (
    page: number = 1,
    limit?: number,
    filter?: Filter[],
    sort?: Sort,
  ) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());

    if (limit) params.append("limit", limit.toString());
    if (filter && Array.isArray(filter)) {
      params.append("filter", JSON.stringify(filter));
    }
    if (sort) params.append("sort", JSON.stringify(sort));

    const url = `/users?${params.toString()}`;
    return api.get(url);
  };

  // 🔹 Pobierz użytkownika po ID
  getById = async (id: number) => {
    if (!id) throw new Error("ID jest wymagane");

    const filter = JSON.stringify([{ by: "id", value: id.toString() }]);
    const url = `/users?filter=${encodeURIComponent(filter)}`;

    return api.get(url);
  };

  // 🔹 Pobierz użytkownika po e-mailu
  getByEmail = async (email: string) => {
    if (!email) throw new Error("Email jest wymagany");

    const filter = JSON.stringify([{ by: "email", value: email }]);
    const url = `/users?filter=${encodeURIComponent(filter)}`;

    return api.get(url);
  };

  // 🔹 Aktualizuj dane użytkownika (np. imię, rola, itp.)
  update = async (id: number, data: Partial<User>) => {
    if (!id || !data) throw new Error("ID i dane są wymagane");
    return api.patch(`/users/${id}`, data);
  };

  // 🔹 Aktualizuj zdjęcie profilowe
  updateImg = async (id: number, img: string) => {
    if (!id || !img) throw new Error("ID i obraz są wymagane");
    return api.patch(`/users/${id}/img`, { img });
  };

  // 🔹 Usuń użytkownika
  delete = async (id: number) => {
    if (!id) throw new Error("ID jest wymagane");
    return api.delete(`/users/${id}`);
  };
}

export default new UsersService();
