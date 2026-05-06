export const industryKeys = {
  all: () => ["industry"] as const,
  list: (params?: { search?: string }) =>
    [...industryKeys.all(), "list", params] as const,
  detail: (id: string) => [...industryKeys.all(), "detail", id] as const,
  requests: (id: string) => [...industryKeys.all(), "requests", id] as const,
};
