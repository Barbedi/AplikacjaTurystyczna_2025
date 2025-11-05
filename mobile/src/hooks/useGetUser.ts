import { useCallback, useState } from "react";
import { Err, Filter, Sort, Users } from "../types";
import usersService from "../services/user.service";

const useGetUsers = () => {
  const [usersData, setUsersData] = useState<Users[][] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Err | null>(null);

  const handleError = useCallback((error: Err) => {
    console.error("Error fetching users:", error);
    setError(error);
  }, []);

  const getAllUsers = useCallback(
    async (
      page: number = 1,
      limit?: number,
      filter?: Filter[],
      sort?: Sort,
    ) => {
      try {
        setLoading(true);
        const response = await usersService.getAll(page, limit, filter, sort);
        if (response.status === 200) {
          setUsersData(response.data.data);
          setError(null);
        }
      } catch (err) {
        handleError(err as Err);
      } finally {
        setLoading(false);
      }
    },
    [handleError],
  );

  const getUserById = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        const response = await usersService.getById(id);
        if (response.status === 200) {
          setUsersData([response.data.data]); // jednolita struktura: array
          setError(null);
        }
      } catch (err) {
        handleError(err as Err);
      } finally {
        setLoading(false);
      }
    },
    [handleError],
  );

  const getUserByEmail = useCallback(
    async (email: string) => {
      try {
        setLoading(true);
        const response = await usersService.getByEmail(email);
        if (response.status === 200) {
          setUsersData([response.data.data]); // jednolita struktura: array
          setError(null);
        }
      } catch (err) {
        handleError(err as Err);
      } finally {
        setLoading(false);
      }
    },
    [handleError],
  );

  return {
    usersData,
    loading,
    error,
    getAllUsers,
    getUserById,
    getUserByEmail,
  } as const;
};

export default useGetUsers;
