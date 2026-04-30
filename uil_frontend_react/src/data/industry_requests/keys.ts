export const industryRequestKeys = {
  all: () => ["industry_request"] as const,
  list: () => [...industryRequestKeys.all(), "list"] as const,
  detail: (id: string) => [...industryRequestKeys.all(), "detail", id] as const,
  adminList: () => [...industryRequestKeys.all(), "list", "admin"] as const,
  adminDetail: (id: string) =>
    [...industryRequestKeys.all(), "detail", "admin", id] as const,
};
