export const industryKeys = {
  all: () => ["industry"] as const,
  list: () => [...industryKeys.all(), "list"] as const,
  detail: (id: string) => [...industryKeys.all(), "detail", id] as const,
  requests: (id: string) => [...industryKeys.all(), "requests", id] as const,
};
