import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { appToast } from "@/lib/toast";
import { IndustryRequestResponse } from "@/types/interfaces.industry_requests";
import {
  IndustryRequestUpdateInput,
  industryRequestUpdateSchema,
} from "@/validation/validation.industry_requests";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { industryRequestKeys } from "./keys";
import { industryRequestUrls } from "./urls";

export const industryRequestUpdate = (data: IndustryRequestUpdateInput) => {
  return safeApiRequest(
    api.patch<IndustryRequestResponse>(
      industryRequestUrls.base(),
      industryRequestUpdateSchema.parse(data),
    ),
  );
};

export const useIndustryRequestUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: industryRequestUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: industryRequestKeys.all() });
      appToast.success("Industry updated successfully");
    },
    onError: (error: any) =>
      appToast.error(error.message || "Failed to update request"),
  });
};
