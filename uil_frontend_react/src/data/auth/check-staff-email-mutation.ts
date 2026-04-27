import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { CheckStaffEmailResponse } from "@/types/interfaces.auth";
import { authUrls } from "./urls";
import {
  CheckStaffEmailInput,
  checkStaffEmailSchema,
} from "@/validation/validation.auth";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const checkStaffEmail = (data: CheckStaffEmailInput) => {
  return safeApiRequest(
    api.post<CheckStaffEmailResponse>(
      authUrls.check_email(),
      checkStaffEmailSchema.parse(data),
    ),
  );
};

export const useCheckStaffEmail = () =>
  useMutation({
    mutationFn: checkStaffEmail,
    onError: (error) => toast.error(error.message || "Failed to check email"),
  });
