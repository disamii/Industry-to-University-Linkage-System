import api, { safeApiRequest } from "@/lib/axios";
import { appToast } from "@/lib/toast";
import { IndustryRequestResponse } from "@/types/interfaces.industry_requests";
import {
  IndustryRequestCreateInput,
  industryRequestCreateSchema,
} from "@/validation/validation.industry_requests";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { industryRequestKeys } from "./keys";
import { industryRequestUrls } from "./urls";

export const industryRequestCreate = (data: IndustryRequestCreateInput) =>
  safeApiRequest(
    api.post<IndustryRequestResponse>(
      industryRequestUrls.base(),
      industryRequestCreateSchema.parse(data),
    ),
  );

export const useIndustryRequestCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: industryRequestCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: industryRequestKeys.all() });
      appToast.success("Industry created successfully");
    },
    onError: (error: any) =>
      appToast.error(error.message || "Failed to create request"),
  });
};
