import { IndustryRequestParams } from "@/features/dashboard/industry_request/request-table/use-industry_request-params";

export const industryRequestOfficeKeys = {
  all: () => ["industry_request", "office"] as const,
  list: (params?: IndustryRequestParams) =>
    [...industryRequestOfficeKeys.all(), "list", params] as const,
};
