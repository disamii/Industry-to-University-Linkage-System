import { IndustryRequestMineParams } from "@/types/interfaces.industry_requests";

export const industryRequestKeys = {
  all: () => ["industry_request"] as const,
  list: () => [...industryRequestKeys.all(), "list"] as const,
  detail: (id: number) => [...industryRequestKeys.all(), "detail", id] as const,
  mine: (params?: IndustryRequestMineParams) =>
    [...industryRequestKeys.all(), "my-requests", "list", params] as const,
};
