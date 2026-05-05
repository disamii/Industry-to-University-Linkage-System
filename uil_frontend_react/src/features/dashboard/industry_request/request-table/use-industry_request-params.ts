import { defaultPaginationParams } from "@/components/reusable/pagination";
import { useUrlParams } from "@/hooks/use-url-params";
import { ActionType, IndustryRequestType } from "@/lib/enums";
import { PaginationParams, Sortable } from "@/types/interfaces";
import { useMemo } from "react";

export type IndustryRequestParams = PaginationParams & {
  search: string;
  type?: IndustryRequestType;
  academic_unit?: number;
  actions__type?: ActionType;
  ordering: Sortable<"created_at" | "title">;
  industry?: number;
};

export const defaultIndustryRequestParams: IndustryRequestParams = {
  ...defaultPaginationParams,
  search: "",
  ordering: "-created_at",
};

const useIndustryRequestParams = () => {
  const { getParam, setParams, removeParams, clearAllParams } =
    useUrlParams<IndustryRequestParams>(defaultIndustryRequestParams);

  // Pagination
  const page = getParam("page");
  const page_size = getParam("page_size");

  // Sort
  const ordering = getParam("ordering");

  // Filtering
  const search = getParam("search");
  const type = getParam("type");
  const academic_unit = getParam("academic_unit");
  const actions__type = getParam("actions__type");
  const industry = getParam("industry");

  const params: IndustryRequestParams = useMemo(
    () => ({
      page,
      page_size,
      search,
      ordering,
      type,
      academic_unit,
      actions__type,
      industry,
    }),
    [
      page,
      page_size,
      search,
      ordering,
      type,
      academic_unit,
      actions__type,
      industry,
    ],
  );

  return { params, setParams, removeParams, clearAllParams };
};

export { useIndustryRequestParams };
