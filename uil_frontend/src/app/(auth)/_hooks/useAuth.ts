"use client";

import apiClient from "@/lib/axios";
import { appToast } from "@/lib/toast";
import { Industry } from "@/types/interfaces.industry";
import { CreateIndustryInput } from "@/validation/validation.auth";
import { useMutation } from "@tanstack/react-query";

export const createIndustry = async (data: CreateIndustryInput) => {
  try {
    const response = await apiClient.post<Industry>("/industry/register/", {
      email: data.email,
      password: data.password,
      name: data.name,
    });

    return response.data;
  } catch (error: any) {
    console.error("Sign up failed:", error.message);
    throw error; // ✅ important
  }
};

export const useCreateIndustryMutation = () => {
  return useMutation({
    mutationFn: createIndustry,
    onSuccess: () => appToast.success("Industry created successfully"),
    onError: (error) => {
      appToast.error(error.message || "Failed to create industry");
    },
  });
};
