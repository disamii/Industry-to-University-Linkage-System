import {
  defaultPaginationParams,
  PaginationParams,
} from "@/hooks/use-pagination-params";
import { useUrlParams } from "@/hooks/use-url-params";
import { AssignmentStatus } from "@/lib/enums";
import { Sortable } from "@/types/interfaces";
import { useMemo } from "react";

export type AssignmentParams = PaginationParams & {
  status?: AssignmentStatus;
  search?: string;
  // user_id?: number;
  ordering: Sortable<"start_date" | "end_date">;
};

export const defaultAssignmentParams: AssignmentParams = {
  ...defaultPaginationParams,
  search: "",
  ordering: "start_date",
};

const useAssignmentParams = () => {
  const { getParam, setParams, removeParams, clearAllParams } =
    useUrlParams<AssignmentParams>(defaultAssignmentParams, "assignments");

  // Pagination
  const page = getParam("page");
  const page_size = getParam("page_size");

  // Sort
  const ordering = getParam("ordering");

  // Filtering
  const search = getParam("search");
  const status = getParam("status");
  // const user_id = getParam("user_id");

  const params: AssignmentParams = useMemo(
    () => ({
      page,
      page_size,
      search,
      status,
      ordering,
      // user_id,
    }),
    [page, page_size, search, status, ordering],
  );

  return { params, setParams, removeParams, clearAllParams };
};

export { useAssignmentParams };
