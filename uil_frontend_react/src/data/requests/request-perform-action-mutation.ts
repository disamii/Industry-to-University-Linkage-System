import { ActionFormFields } from "@/features/dashboard/request/utils.request-actions";
import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { toFormData } from "@/lib/utils";
import { PerformActionResponse } from "@/types/interfaces.actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { assignmentKeys } from "../assignments/keys";
import { postKeys } from "../posts/keys";
import { industryRequestKeys } from "./industry/keys";
import { industryRequestOfficeKeys } from "./office/keys";
import { industryRequestOfficeUrls } from "./office/urls";

export const performAction = (
  data: Record<ActionFormFields, string | number>,
) => {
  const formData = toFormData(data, ["actionToPerform", "assigned_users"]);
  const actionToPerform = data.actionToPerform;

  // Convert Assigned Users
  Object.entries(data).forEach(([key, value]) => {
    if (key === "assigned_users" && Array.isArray(value)) {
      value.forEach((userId) => {
        formData.append("assigned_users", String(userId));
      });
    }
  });

  const id = formData.get("id");
  if (!id) throw new Error("Please provide request id first");

  const url =
    actionToPerform === "create"
      ? industryRequestOfficeUrls.perform_action(Number(id))
      : industryRequestOfficeUrls.alter_action(Number(id));

  return safeApiRequest(
    api.post<PerformActionResponse>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  );
};

export const usePerformActionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: performAction,
    onSuccess: (data) => {
      toast.success(data.message);

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
