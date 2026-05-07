import { AssignmentParams } from "@/features/dashboard/office/assignments/assignments-params";

export const assignmentsKeys = {
  all: () => ["assignments"] as const,
  list: (params?: AssignmentParams) =>
    [...assignmentsKeys.all(), "list", params] as const,
};
