import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/utils.axios";
import { useAuthStore } from "@/store/use-auth-store";
import { UserUpdatePasswordInput } from "@/validation/validation.auth";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { userUrls } from "./urls";

export const changePassword = async (data: UserUpdatePasswordInput) =>
  safeApiRequest(api.post<null>(userUrls.change_password(), data));

export const useChangePasswordMutation = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: changePassword,
    onError: (error) =>
      toast.error(error.message || "Unable to change password."),
    onSuccess: () => {
      toast.success("Password Changed Successfully, You should signin again!");
      clearAuth();
    },
  });
};
