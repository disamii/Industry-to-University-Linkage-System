import { defaultPaginationParams } from "@/components/reusable/pagination";
import { useUrlParams } from "@/hooks/use-url-params";
import { PaginationParams, Sortable } from "@/types/interfaces";
import { useMemo } from "react";

export type IndustryParams = PaginationParams & {
  industry_type?: IndustryType;
  search?: string;
  ordering: Sortable<"created_at" | "updated_at" | "name">;
};

export const defaultIndustryParams: IndustryParams = {
  ...defaultPaginationParams,
  search: "",
  ordering: "name",
};

const useIndustryParams = () => {
  const { getParam, setParams, removeParams, clearAllParams } =
    useUrlParams<IndustryParams>(defaultIndustryParams);

  // Pagination
  const page = getParam("page");
  const page_size = getParam("page_size");

  // Sort
  const ordering = getParam("ordering");

  // Filtering
  const industry_type = getParam("industry_type");
  const search = getParam("search");

  const params: IndustryParams = useMemo(
    () => ({
      page,
      page_size,
      ordering,
      industry_type,
      search,
    }),
    [page, page_size, search, industry_type, ordering],
  );

  return { params, setParams, removeParams, clearAllParams };
};

export { useIndustryParams };
