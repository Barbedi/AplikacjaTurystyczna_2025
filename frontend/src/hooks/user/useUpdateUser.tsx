import { useCallback } from "react";
import usersService from "../../services/user.service";
import { UserInfo } from "../../assets/Data";

const useUpdateUser = () => {
  const updateUser = useCallback(async (id: number, userInfo: UserInfo) => {
    try {
      const response = await usersService.update(id, userInfo);
      if (response.status === 200) {
        return response.data.message;
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }, []);

  const updateUserImg = useCallback(async (id: number, img: string) => {
    try {
      const response = await usersService.updateImg(id, img);
      if (response.status === 200) {
        return response.data.message;
      }
    } catch (error) {
      console.error("Error updating user image:", error);
    }
  }, []);

  return { updateUserImg, updateUser };
};
export default useUpdateUser;
