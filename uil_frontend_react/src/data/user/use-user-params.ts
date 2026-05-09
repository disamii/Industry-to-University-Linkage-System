import {
  defaultPaginationParams,
  PaginationParams,
} from "@/hooks/use-pagination-params";
import { useUrlParams } from "@/hooks/use-url-params";
import { Sortable } from "@/types/interfaces";
import { useMemo } from "react";

export type UserParams = PaginationParams & {
  academic_unit?: number;
  search?: string;
  ordering: Sortable<"created_at" | "updated_at" | "first_name">;
};

export const defaultUserParams: UserParams = {
  ...defaultPaginationParams,
  search: "",
  ordering: "first_name",
};

const useUserParams = () => {
  const { getParam, setParams, removeParams, clearAllParams } =
    useUrlParams<UserParams>(defaultUserParams, "users");

  // Pagination
  const page = getParam("page");
  const page_size = getParam("page_size");

  // Sort
  const ordering = getParam("ordering");

  // Filtering
  const academic_unit = getParam("academic_unit");
  const search = getParam("search");

  const params: UserParams = useMemo(
    () => ({
      page,
      page_size,
      ordering,
      academic_unit,
      search,
    }),
    [page, page_size, academic_unit, search, ordering],
  );

  return { params, setParams, removeParams, clearAllParams };
};

export { useUserParams };
