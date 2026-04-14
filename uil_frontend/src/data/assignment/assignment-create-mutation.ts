import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { appToast } from "@/lib/toast";
import {
  AssignStaffInput,
  assignStaffSchema,
} from "@/validation/validation.assignment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignmentUrls } from "./urls";
import { AssignmentResponse } from "@/types/interfaces.assignments";
import { assignmentKeys } from "./keys";

export const assignStaff = (data: AssignStaffInput) => {
  return safeApiRequest(
    api.post<AssignmentResponse>(
      assignmentUrls.base(),
      assignStaffSchema.parse(data),
    ),
  );
};

export const useAssignStaffMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.all() });
      appToast.success("Staff member assigned successfully");
    },
    onError: (error: any) =>
      appToast.error(error.message || "Failed to assign staff member"),
  });
};
