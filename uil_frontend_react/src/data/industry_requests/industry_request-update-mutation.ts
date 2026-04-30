import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { IndustryRequestResponse } from "@/types/interfaces.industry_requests";
import {
  IndustryRequestUpdateInput,
  industryRequestUpdateSchema,
} from "@/validation/validation.industry_requests";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { industryRequestKeys } from "./keys";
import { industryRequestUrls } from "./urls";
import toast from "react-hot-toast";

export const industryRequestUpdate = ({
  id,
  data,
}: {
  id: string;
  data: IndustryRequestUpdateInput;
}) => {
  return safeApiRequest(
    api.patch<IndustryRequestResponse>(
      industryRequestUrls.byId(id),
      industryRequestUpdateSchema.parse(data),
    ),
  );
};

export const useIndustryRequestUpdateMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IndustryRequestUpdateInput) =>
      industryRequestUpdate({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: industryRequestKeys.all() });
      toast.success("Request updated successfully");
    },
    onError: (error: any) =>
      toast.error(error.message || "Failed to update request"),
  });
};
