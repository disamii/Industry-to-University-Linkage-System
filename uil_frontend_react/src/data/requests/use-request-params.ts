import {
  defaultPaginationParams,
  PaginationParams,
} from "@/hooks/use-pagination-params";
import { useUrlParams } from "@/hooks/use-url-params";
import { ActionType, Entity, IndustryRequestType } from "@/lib/enums";
import { Sortable } from "@/types/interfaces";
import { useMemo } from "react";

export type MyRequestParams = {
  direction?: "incoming" | "outgoing";
  entity?: Entity;
  enabled: boolean;
  disablePagination?: boolean;
};

export type RequestParams = PaginationParams & {
  search: string;
  type?: IndustryRequestType;
  academic_unit?: number;
  actions__type?: ActionType;
  ordering: Sortable<"created_at" | "title">;
  industry?: number;
};

export const defaultRequestParams: RequestParams = {
  ...defaultPaginationParams,
  search: "",
  ordering: "-created_at",
};

const useRequestParams = (
  entity?: Entity,
  direction?: "incoming" | "outgoing",
) => {
  const { getParam, setParams, removeParams, clearAllParams } =
    useUrlParams<RequestParams>(defaultRequestParams, "requests");

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

  const params: RequestParams = useMemo(
    () => ({
      page,
      page_size,
      search,
      ordering,
      type,
      academic_unit,
      actions__type,
      industry,
      direction,
      entity,
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
      direction,
      entity,
    ],
  );

  return { params, setParams, removeParams, clearAllParams };
};

export { useRequestParams };
