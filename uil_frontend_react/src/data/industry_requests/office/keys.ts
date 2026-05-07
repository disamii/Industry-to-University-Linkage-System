import { IndustryRequestParams } from "@/features/dashboard/industry_request/use-industry_request-params";

export const industryRequestOfficeKeys = {
  all: () => ["industry_request", "office"] as const,
  list: (params?: IndustryRequestParams) =>
    [...industryRequestOfficeKeys.all(), "list", params] as const,
  detail: (id: number) =>
    [...industryRequestOfficeKeys.all(), "detail", id] as const,
};
