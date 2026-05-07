import { IndustryParams } from "@/features/dashboard/office/industry-management/use-industry-params";

export const industryKeys = {
  all: () => ["industry"] as const,
  list: (params?: IndustryParams) =>
    [...industryKeys.all(), "list", params] as const,
  detail: (id: string) => [...industryKeys.all(), "detail", id] as const,
  requests: (id: string) => [...industryKeys.all(), "requests", id] as const,
};
