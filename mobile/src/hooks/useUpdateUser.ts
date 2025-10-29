import { useCallback } from "react";
import usersService from "../services/user.service";
import { Users } from "../types";

const useUpdateUser = () => {
  // 🔹 Aktualizacja danych użytkownika
  const updateUser = useCallback(async (id: number, userInfo: Users) => {
    try {
      const response = await usersService.update(id, userInfo);
      if (response.status === 200) {
        console.log("✅ User updated:", response.data);
        return response.data.message || "Profil zaktualizowany";
      } else {
        console.warn("⚠️ Unexpected response:", response.status);
        return null;
      }
    } catch (error: any) {
      console.error("❌ Błąd przy aktualizacji użytkownika:", error.message);
      throw new Error(
        error.response?.data?.message || "Nie udało się zaktualizować profilu.",
      );
    }
  }, []);

  // 🔹 Aktualizacja zdjęcia użytkownika
  const updateUserImg = useCallback(async (id: number, img: string) => {
    try {
      const response = await usersService.updateImg(id, img);
      if (response.status === 200) {
        console.log("📸 User image updated:", response.data);
        return response.data.message || "Zdjęcie profilowe zaktualizowane";
      } else {
        console.warn("⚠️ Unexpected response:", response.status);
        return null;
      }
    } catch (error: any) {
      console.error("❌ Błąd przy aktualizacji zdjęcia:", error.message);
      throw new Error(
        error.response?.data?.message || "Nie udało się zaktualizować zdjęcia.",
      );
    }
  }, []);

  return { updateUser, updateUserImg };
};

export default useUpdateUser;
