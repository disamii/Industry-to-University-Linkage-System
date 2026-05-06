import { ActionFormFields } from "@/features/dashboard/industry_request/utils.industry_request-actions";
import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { toFormData } from "@/lib/utils";
import { RequestResponse } from "@/types/interfaces.actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { industryRequestKeys } from "./industry/keys";
import { industryRequestOfficeKeys } from "./office/keys";
import { industryRequestOfficeUrls } from "./office/urls";

export const performAction = (
  data: Record<ActionFormFields, string | number>,
) => {
  const formData = toFormData(data);
  const id = formData.get("id");

  if (!id) throw new Error("Please provide request id first");

  return safeApiRequest(
    api.post<RequestResponse>(
      industryRequestOfficeUrls.perform_action(Number(id)),
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
    onSuccess: (data) => {
      toast.success(`Request ${data.type.split("_").join(" ")} successfully`);

      queryClient.invalidateQueries({
        queryKey: industryRequestOfficeKeys.all(),
      });
      queryClient.invalidateQueries({
        queryKey: industryRequestKeys.all(),
      });
    },
    onError: (error: any) =>
      toast.error(error.message || "Failed to perform the action"),
  });
};
