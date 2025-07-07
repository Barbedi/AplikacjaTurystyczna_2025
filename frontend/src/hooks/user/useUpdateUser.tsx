import { useCallback } from "react";
import usersService from "../../services/user.service";

const useUpdateUser = () => {
    const updateUserImg = useCallback(
        async (id: number, img: string) => {
            try {
                const response = await usersService.updateImg(id, img);
                if (response.status === 200) {
                    return response.data.message;
                }
            } catch (error) {
                console.error("Error updating user image:", error);
            }
        },
        []
    );

    return { updateUserImg };
}
export default useUpdateUser;



