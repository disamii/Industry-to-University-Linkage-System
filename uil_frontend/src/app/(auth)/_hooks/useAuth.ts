"use client";

import { appToast } from "@/lib/toast";
import { createIndustry } from "@/services/services.auth";
import { useMutation } from "@tanstack/react-query";

export const useCreateIndustryMutation = () => {
  return useMutation({
    mutationFn: createIndustry,
    onSuccess: () => appToast.success("Industry created successfully"),
    onError: (error) => {
      appToast.error(error.message || "Failed to create industry");
    },
  });
};
