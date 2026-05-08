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
import { ActionFormFields } from "@/features/dashboard/industry_request/utils.industry_request-actions";

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
    api.post<ActionResponse>(url, formData, {
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
