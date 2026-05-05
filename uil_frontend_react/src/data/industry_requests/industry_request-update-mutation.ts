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
import { toFormData } from "@/lib/utils"; // Added this
import toast from "react-hot-toast";

export const industryRequestUpdate = async ({
  id,
  data,
}: {
  id?: number;
  data: IndustryRequestUpdateInput;
}): Promise<IndustryRequestResponse> => {
  if (!id) {
    throw new Error("ID is required for update");
  }

  const validated = industryRequestUpdateSchema.parse(data);
  const formData = toFormData(validated);

  return safeApiRequest(
    api.patch<IndustryRequestResponse>(industryRequestUrls.byId(id), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  );
};

export const useIndustryRequestUpdateMutation = (id?: number) => {
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
