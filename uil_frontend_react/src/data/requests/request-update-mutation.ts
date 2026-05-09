import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { toFormData } from "@/lib/utils"; // Added this
import { RequestResponse } from "@/types/interfaces.requests";
import { IndustryRequestUpdateInput } from "@/validation/validation.requests";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { industryRequestKeys } from "./industry/keys";
import { industryRequestUrls } from "./industry/urls";

export const requestUpdate = async ({
  id,
  data,
}: {
  id?: number;
  data: IndustryRequestUpdateInput;
}): Promise<RequestResponse> => {
  if (!id) {
    throw new Error("ID is required for update");
  }

  const formData = toFormData(data);

  return safeApiRequest(
    api.patch<RequestResponse>(industryRequestUrls.byId(id), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  );
};

export const useRequestUpdateMutation = (id?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IndustryRequestUpdateInput) =>
      requestUpdate({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: industryRequestKeys.all() });
      toast.success("Request updated successfully");
    },
    onError: (error: any) =>
      toast.error(error.message || "Failed to update request"),
  });
};
