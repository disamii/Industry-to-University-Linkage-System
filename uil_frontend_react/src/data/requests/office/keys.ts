import { RequestParams } from "@/data/requests/use-request-params";

export const industryRequestOfficeKeys = {
  all: () => ["industry_request", "office"] as const,
  list: (params?: RequestParams) =>
    [...industryRequestOfficeKeys.all(), "list", params] as const,
  detail: (id: number) =>
    [...industryRequestOfficeKeys.all(), "detail", id] as const,
};
