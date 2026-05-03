import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { IndustryRequestResponse } from "@/types/interfaces.industry_requests";
import {
  IndustryRequestCreateInput,
  industryRequestCreateSchema,
} from "@/validation/validation.industry_requests";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { industryRequestKeys } from "./keys";
import { industryRequestUrls } from "./urls";
import { toFormData } from "@/lib/utils";

export const industryRequestCreate = (data: IndustryRequestCreateInput) => {
  const validated = industryRequestCreateSchema.parse(data);

  const formData = toFormData(validated);
  formData.append("requesting_entity", "industry");

  // console.log(Object.fromEntries(formData.entries()));

  return safeApiRequest(
    api.post<IndustryRequestResponse>(industryRequestUrls.base(), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  );
};

export const useIndustryRequestCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: industryRequestCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: industryRequestKeys.all() });
      toast.success("Request created successfully");
    },
    onError: (error: any) =>
      toast.error(error.message || "Failed to create request"),
  });
};
