import { RequestParams } from "@/data/requests/use-request-params";

export const industryRequestKeys = {
  all: () => ["industry_request"] as const,
  detail: (id: number) => [...industryRequestKeys.all(), "detail", id] as const,
  mine: (params?: RequestParams) =>
    [...industryRequestKeys.all(), "my-requests", "list", params] as const,
};
