import { useUrlParams } from "@/hooks/use-url-params";
import { createGetRequest } from "@/lib/axios.utils";
import { ApiPaginatedResponse, PageParams } from "@/types/interfaces";
import {
  IndustryRequestMineResponse,
  IndustryRequestMineStats,
} from "@/types/interfaces.industry_requests";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { industryRequestKeys } from "./keys";
import { industryRequestUrls } from "./urls";
import { PAGE_SIZE } from "@/lib/constants";
import { useEffect, useMemo } from "react";
import { usePaginatedPrefetch } from "@/hooks/use-paginated-prefetch";

// Params
export type IndustryRequestMineParams = PageParams & {};

// Api Call
export const getIndustryRequestMineList = createGetRequest<
  ApiPaginatedResponse<
    IndustryRequestMineResponse,
    undefined,
    IndustryRequestMineStats
  >
>(industryRequestUrls.mine());

// React query hook
export const useGetIndustryRequestMineList = () => {
  const queryClient = useQueryClient();
  const { getParam } = useUrlParams<IndustryRequestMineParams>();

  // Pages
  const page = getParam("page", 1);
  const page_size = getParam("page_size", PAGE_SIZE);

  const params: IndustryRequestMineParams = useMemo(
    () => ({
      page,
      page_size,
    }),
    [page, page_size],
  );

  const query = useQuery({
    queryKey: industryRequestKeys.mine(params),
    queryFn: () => getIndustryRequestMineList(params),
    placeholderData: (prev) => prev,
  });

  usePaginatedPrefetch({
    queryClient,
    baseKey: industryRequestKeys.mine().slice(0, -1),
    queryFn: getIndustryRequestMineList,
    params,
    links: query.data?.pagination.links,
    isPlaceholderData: query.isPlaceholderData,
  });

  return query;
};
