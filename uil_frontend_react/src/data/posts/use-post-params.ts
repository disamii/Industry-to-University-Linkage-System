import {
  defaultPaginationParams,
  PaginationParams,
} from "@/hooks/use-pagination-params";
import { useUrlParams } from "@/hooks/use-url-params";
import { Sortable } from "@/types/interfaces";
import { useMemo } from "react";

export type PostParams = PaginationParams & {
  post_type?: string;
  is_published?: boolean;
  is_internal_only?: boolean;
  // content_type?: string;
  // published_at?: string; // gte/lte
  // expires_at?: string; // gte/lte
  search?: string;
  ordering: Sortable<"created_at" | "updated_at" | "published_at" | "title">;
};

export const defaultPostParams: PostParams = {
  ...defaultPaginationParams,
  search: "",
  ordering: "-published_at",
};

const usePostParams = () => {
  const { getParam, setParams, removeParams, clearAllParams } =
    useUrlParams<PostParams>(defaultPostParams, "posts");

  // Pagination
  const page = getParam("page");
  const page_size = getParam("page_size");

  // Sort
  const ordering = getParam("ordering");

  // Filtering
  const post_type = getParam("post_type");
  const is_published = getParam("is_published");
  const is_internal_only = getParam("is_internal_only");
  // const content_type = getParam("content_type");
  const search = getParam("search");

  const params: PostParams = useMemo(
    () => ({
      page,
      page_size,
      ordering,
      post_type,
      is_published,
      is_internal_only,
      // content_type,
      search,
    }),
    [
      page,
      page_size,
      search,
      post_type,
      is_published,
      is_internal_only,
      ordering,
    ],
  );

  return { params, setParams, removeParams, clearAllParams };
};

export { usePostParams };
