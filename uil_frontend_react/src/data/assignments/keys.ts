import { AssignmentParams } from "@/features/dashboard/office/assignments/assignment-params";

export const assignmentKeys = {
  all: () => ["assignments"] as const,
  list: (params?: AssignmentParams) =>
    [...assignmentKeys.all(), "list", params] as const,
};
