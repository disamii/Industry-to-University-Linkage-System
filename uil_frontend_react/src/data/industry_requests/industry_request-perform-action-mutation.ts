import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { IndustryRequestResponse } from "@/types/interfaces.industry_requests";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { industryRequestKeys } from "./industry/keys";
import { industryRequestOfficeKeys } from "./office/keys";
import { industryRequestOfficeUrls } from "./office/urls";
import { toFormData } from "@/lib/utils";

export const performAction = (data: any) => {
  // const validated = industryRequestCreateSchema.parse(data);
  const formData = toFormData(data);

  return safeApiRequest(
    api.post<IndustryRequestResponse>(
      industryRequestOfficeUrls.perform_action(),
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
    mutationFn: performAction,
    onSuccess: (data: any) => {
      console.log(data);

      queryClient.invalidateQueries({
        queryKey: [
          ...industryRequestOfficeKeys.all(),
          ...industryRequestKeys.all(),
        ],
      });
    },
    onError: (error: any) =>
      toast.error(error.message || "Failed to perform the action"),
  });
};
