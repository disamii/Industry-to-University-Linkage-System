import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { appToast } from "@/lib/toast";
import { IndustryResponse } from "@/types/interfaces.industry";
import {
  IndustryCreateInput,
  industryCreateSchema,
} from "@/validation/validation.industry";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { industryUrls } from "./urls";
import { industryKeys } from "./keys";

export const industryCreate = (data: IndustryCreateInput) => {
  return safeApiRequest(
    api.post<IndustryResponse>(
      industryUrls.register(),
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
      appToast.success("Industry created successfully");
    },
    onError: (error: any) =>
      appToast.error(error.message || "Failed to create industry"),
  });
};
