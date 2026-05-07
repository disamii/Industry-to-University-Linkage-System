import { IndustryRequestParams } from "@/data/industry_requests/use-industry_request-params";

export const industryRequestKeys = {
  all: () => ["industry_request"] as const,
  list: () => [...industryRequestKeys.all(), "list"] as const,
  detail: (id: number) => [...industryRequestKeys.all(), "detail", id] as const,
  mine: (params?: IndustryRequestParams) =>
    [...industryRequestKeys.all(), "my-requests", "list", params] as const,
};
