import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/utils.axios";
import { useAuthStore } from "@/store/use-auth-store";
import { UserProfile } from "@/types/interfaces.user";
import { UserAccountUpdateInput } from "@/validation/validation.auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { userUrls } from "./urls";
import { userKeys } from "./keys";

export const userUpdateAccount = async (data: UserAccountUpdateInput) =>
  safeApiRequest(api.patch<UserProfile>(userUrls.profile(), data));

export const useUserAccountMutation = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userUpdateAccount,
    onError: (error) =>
      toast.error(error.message || "Unable to update your account."),
    onSuccess: (updated) => {
      toast.success("Account Updated Successfully");
      queryClient.invalidateQueries({ queryKey: userKeys.all() });
      setAuth(updated, accessToken!);
    },
  });
};
