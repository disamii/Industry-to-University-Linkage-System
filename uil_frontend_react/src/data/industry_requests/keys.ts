import { IndustryRequestMineParams } from "./industry_requests-mine-list-query";

export const industryRequestKeys = {
  all: () => ["industry_request"] as const,
  list: () => [...industryRequestKeys.all(), "list"] as const,
  detail: (id: number) => [...industryRequestKeys.all(), "detail", id] as const,
  mine: (params?: IndustryRequestMineParams) =>
    [...industryRequestKeys.all(), "my-requests", "list", params] as const,
};
