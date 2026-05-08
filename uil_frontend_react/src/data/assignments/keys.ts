import { AssignmentParams } from "@/data/assignments/use-assignment-params";

export const assignmentKeys = {
  all: () => ["assignments"] as const,
  list: (params?: AssignmentParams) =>
    [...assignmentKeys.all(), "list", params] as const,
  detail: (id: number) => [...assignmentKeys.all(), "detail", id] as const,
  list_by_user_id: (user_id?: number, params?: AssignmentParams) =>
    [...assignmentKeys.all(), "list", "by-user-id", user_id, params] as const,
};
