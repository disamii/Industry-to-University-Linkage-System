import { appToast } from "@/lib/toast";
import { IndustryRequestResponse } from "@/types/interfaces.industry_requests";
import {
  IndustryRequestCreateInput,
  industryRequestCreateSchema,
} from "@/validation/validation.industry_requests";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { industryRequestKeys } from "./keys";
import { industryRequestUrls } from "./urls";
import { safeApiRequest } from "@/lib/axios.utils";
import apiClient from "@/lib/axios.client";
import apiServer from "@/lib/axios.server";
import { useUserStore } from "@/store/useUserStore";

export const industryRequestCreate = ({
  access_token,
  data,
}: {
  access_token: string;
  data: IndustryRequestCreateInput;
}) => {
  const api = access_token ? apiClient(access_token) : apiServer;

  return safeApiRequest(
    api.post<IndustryRequestResponse>(
      industryRequestUrls.base(),
      industryRequestCreateSchema.parse(data),
    ),
  );
};

export const useIndustryRequestCreateMutation = () => {
  const queryClient = useQueryClient();
  const { access_token } = useUserStore();

  return useMutation({
    mutationFn: (data: IndustryRequestCreateInput) =>
      industryRequestCreate({ access_token, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: industryRequestKeys.all() });
      appToast.success("Industry created successfully");
    },
    onError: (error: any) =>
      appToast.error(error.message || "Failed to create request"),
  });
};
