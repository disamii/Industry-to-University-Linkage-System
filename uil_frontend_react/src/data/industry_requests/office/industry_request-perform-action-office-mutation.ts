import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { toFormData } from "@/lib/utils";
import { IndustryRequestResponse } from "@/types/interfaces.industry_requests";
import { IndustryRequestCreateInput } from "@/validation/validation.industry_requests";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { industryRequestKeys } from "../industry/keys";
import { industryRequestOfficeKeys } from "./keys";
import { industryRequestOfficeUrls } from "./urls";

export const performActionOffice = (data: IndustryRequestCreateInput) => {
  // const validated = industryRequestCreateSchema.parse(data);
  const formData = toFormData(data);

  return safeApiRequest(
    api.post<IndustryRequestResponse>(
      industryRequestOfficeUrls.base(),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    ),
  );
};

export const usePerformActionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: performActionOffice,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          ...industryRequestOfficeKeys.all(),
          ...industryRequestKeys.all(),
        ],
      });
      toast.success("Action performed successfully");
    },
    onError: (error: any) =>
      toast.error(error.message || "Failed to perform the action"),
  });
};
