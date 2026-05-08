import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { formatType, toFormData } from "@/lib/utils";
import { ActionResponse } from "@/types/interfaces.actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { assignmentKeys } from "../assignments/keys";
import { postKeys } from "../posts/keys";
import { industryRequestKeys } from "./industry/keys";
import { industryRequestOfficeKeys } from "./office/keys";
import { industryRequestOfficeUrls } from "./office/urls";

export const performAction = (data: Record<string, any>) => {
  const formData = toFormData(data);
  formData.delete("assigned_users");

  Object.entries(data).forEach(([key, value]) => {
    if (key === "assigned_users" && Array.isArray(value)) {
      value.forEach((userId) => {
        formData.append("assigned_users", String(userId));
      });
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  const id = formData.get("id");

  if (!id) throw new Error("Please provide request id first");

  return safeApiRequest(
    api.post<ActionResponse>(
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
      toast.success(`Request ${formatType(data.type)} successfully`);

      queryClient.invalidateQueries({
        queryKey: industryRequestOfficeKeys.all(),
      });
      queryClient.invalidateQueries({
        queryKey: industryRequestKeys.all(),
      });
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.all(),
      });
      queryClient.invalidateQueries({
        queryKey: postKeys.all(),
      });
    },
    onError: (error: any) =>
      toast.error(error.message || "Failed to perform the action"),
  });
};
