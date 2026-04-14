export const assignmentKeys = {
  all: () => ["assignment"] as const,
  list: () => [...assignmentKeys.all(), "list"] as const,
  detail: (id: string) => [...assignmentKeys.all(), "detail", id] as const,
  detailByRequestId: (request_id: string) =>
    [...assignmentKeys.all(), "detail-by-request-id", request_id] as const,
};
