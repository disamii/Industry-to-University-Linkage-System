import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/utils.axios";
import { Entity } from "@/lib/enums";
import { toFormData } from "@/lib/utils";
import { RequestResponse } from "@/types/interfaces.requests";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { industryRequestKeys } from "./industry/keys";
import { industryRequestUrls } from "./industry/urls";

type CreateRequestMutationVariables = {
  data: any;
  requesting_entity: Entity;
};

export const requestCreate = ({
  data,
  requesting_entity,
}: CreateRequestMutationVariables) => {
  const formData = toFormData(data);
  formData.append("requesting_entity", requesting_entity);

  // console.log(Object.fromEntries(formData.entries()));

  return safeApiRequest(
    api.post<RequestResponse>(industryRequestUrls.base(), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  );
};

export const useRequestCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, requesting_entity }: CreateRequestMutationVariables) =>
      requestCreate({ data, requesting_entity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: industryRequestKeys.all() });
      toast.success("Request created successfully");
    },
    onError: (error: any) =>
      toast.error(error.message || "Failed to create request"),
  });
};
