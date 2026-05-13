import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/utils.axios";
import { CheckStaffEmailResponse } from "@/types/interfaces.auth";
import {
  CheckStaffEmailInput,
  checkStaffEmailSchema,
} from "@/validation/validation.auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { userKeys } from "../user/keys";
import { authUrls } from "./urls";

export const checkStaffEmail = (data: CheckStaffEmailInput) => {
  return safeApiRequest(
    api.post<CheckStaffEmailResponse>(
      authUrls.check_email(),
      checkStaffEmailSchema.parse(data),
    ),
  );
};

export const useCheckStaffEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkStaffEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all() });
    },
    onError: (error) => toast.error(error.message || "Failed to check email"),
  });
};
