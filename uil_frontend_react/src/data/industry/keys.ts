import { IndustryParams } from "@/data/industry/use-industry-params";

export const industryKeys = {
  all: () => ["industry"] as const,
  list: (params?: IndustryParams) =>
    [...industryKeys.all(), "list", params] as const,
  detail: (id: number) => [...industryKeys.all(), "detail", id] as const,
  me: () => [...industryKeys.all(), "me"] as const,
};
