import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { IndustryResponse } from "@/types/interfaces.industry";
import {
  IndustryUpdateInput,
  industryUpdateSchema,
} from "@/validation/validation.industry";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { industryKeys } from "./keys";
import { industryUrls } from "./urls";
import toast from "react-hot-toast";

export const industryUpdate = ({
  id,
  data,
}: {
  id: string;
  data: IndustryUpdateInput;
}) => {
  return safeApiRequest(
    api.patch<IndustryResponse>(
      industryUrls.byId(id),
      industryUpdateSchema.parse(data),
    ),
  );
};

export const useIndustryUpdateMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IndustryUpdateInput) => industryUpdate({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: industryKeys.all() });
      toast.success("Industry updated successfully");
    },
    onError: (error: any) =>
      toast.error(error.message || "Failed to industry request"),
  });
};
