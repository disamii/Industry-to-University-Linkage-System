import { appToast } from "@/lib/toast";
import { checkStaffEmail, createIndustry } from "@/services/services.auth";
import { useMutation } from "@tanstack/react-query";

export const useCreateIndustryMutation = () =>
  useMutation({
    mutationFn: createIndustry,
    onSuccess: () => appToast.success("Industry created successfully"),
    onError: (error) => {
      appToast.error(error.message || "Failed to create industry");
    },
  });

export const useCheckStaffEmail = () =>
  useMutation({
    mutationFn: checkStaffEmail,
    onError: (error) =>
      appToast.error(error.message || "Failed to check email"),
  });
