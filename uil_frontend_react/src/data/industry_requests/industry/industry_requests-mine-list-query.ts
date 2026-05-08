import { useIndustryRequestParams } from "@/data/industry_requests/use-industry_request-params";
import { usePaginatedPrefetch } from "@/hooks/use-paginated-prefetch";
import { createGetRequest } from "@/lib/axios.utils";
import { ApiPaginatedResponse } from "@/types/interfaces";
import {
  IndustryRequestMineResponse,
  IndustryRequestStats,
} from "@/types/interfaces.industry_requests";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { industryRequestKeys } from "./keys";
import { industryRequestUrls } from "./urls";

export const getIndustryRequestMineList = createGetRequest<
  ApiPaginatedResponse<
    IndustryRequestMineResponse,
    undefined,
    IndustryRequestStats
  >
>(industryRequestUrls.mine());

export const useGetIndustryRequestMineList = () => {
  const queryClient = useQueryClient();
  const { params } = useIndustryRequestParams();

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
