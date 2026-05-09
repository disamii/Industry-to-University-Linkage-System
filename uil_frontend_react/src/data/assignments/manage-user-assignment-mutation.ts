import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { assignmentKeys } from "./keys";
import { industryRequestKeys } from "../requests/industry/keys";
import { industryRequestOfficeKeys } from "../requests/office/keys";
import { postKeys } from "../posts/keys";
import { assignmentUrls } from "./urls";

export const manageUserAssignment = (data: {
  assignment_id: number;
  user_ids: number[];
  action: "add" | "remove";
}) => {
  const { assignment_id, user_ids, action } = data;

  // Dynamically select URL based on action
  const url =
    action === "add"
      ? assignmentUrls.add_users(assignment_id)
      : assignmentUrls.remove_users(assignment_id);

  return safeApiRequest(api.patch<{ detail: string }>(url, { user_ids }));
};

export const useManageUserAssignmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: manageUserAssignment,
    onSuccess: (data) => {
      toast.success(data.detail);

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
