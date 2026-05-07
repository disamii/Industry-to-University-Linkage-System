import { IndustryParams } from "@/types/interfaces.industry";

export const industryKeys = {
  all: () => ["assignments"] as const,
  list: (params?: IndustryParams) =>
    [...industryKeys.all(), "list", params] as const,
};
