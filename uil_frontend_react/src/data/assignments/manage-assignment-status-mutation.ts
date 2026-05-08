import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { AssignmentStatus } from "@/lib/enums";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { industryRequestKeys } from "../industry_requests/industry/keys";
import { industryRequestOfficeKeys } from "../industry_requests/office/keys";
import { postKeys } from "../posts/keys";
import { assignmentKeys } from "./keys";
import { assignmentUrls } from "./urls";

export const manageAssignmentStatus = (data: {
  assignment_id: number;
  status: AssignmentStatus;
}) => {
  const { assignment_id, status } = data;

  return safeApiRequest(
    api.patch<{ detail: string; status: AssignmentStatus }>(
      assignmentUrls.change_status(assignment_id),
      {
        status,
      },
    ),
  );
};

export const useManageAssignmentStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: manageAssignmentStatus,
    onSuccess: (res) => {
      toast.success(`Status Successfully changed to ${res.status}`);

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
