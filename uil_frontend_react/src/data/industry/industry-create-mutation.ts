import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { IndustryResponse } from "@/types/interfaces.industry";
import {
  IndustryCreateInput,
  industryCreateSchema,
} from "@/validation/validation.industry";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { industryUrls } from "./urls";
import { industryKeys } from "./keys";
import toast from "react-hot-toast";

export const industryCreate = (data: IndustryCreateInput) => {
  return safeApiRequest(
    api.post<IndustryResponse>(
      industryUrls.base(),
      industryCreateSchema.parse(data),
    ),
  );
};

export const useIndustryCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: industryCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: industryKeys.all() });
      toast.success("Industry created successfully");
    },
    onError: (error: any) =>
      toast.error(error.message || "Failed to create industry"),
  });
};
