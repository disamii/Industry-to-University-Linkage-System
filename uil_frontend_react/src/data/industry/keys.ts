import { IndustryParams } from "@/data/industry/use-industry-params";

export const industryKeys = {
  all: () => ["industry"] as const,
  list: (params?: IndustryParams) =>
    [...industryKeys.all(), "list", params] as const,
};
