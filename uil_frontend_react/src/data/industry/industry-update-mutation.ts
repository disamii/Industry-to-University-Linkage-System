import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/utils.axios";
import { IndustryResponse } from "@/types/interfaces.industry";
import {
  ContactPersonUpdateInput,
  IndustryUpdateInput,
} from "@/validation/validation.industry";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { industryKeys } from "./keys";
import { industryUrls } from "./urls";

export const industryUpdate = (
  data: IndustryUpdateInput | ContactPersonUpdateInput,
) => {
  return safeApiRequest(api.patch<IndustryResponse>(industryUrls.me(), data));
};

export const useIndustryUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: industryUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: industryKeys.all() });
      toast.success("Updated successfully");
    },
    onError: (error: any) => toast.error(error.message || "Unable to update"),
  });
};
