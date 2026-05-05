import { useIndustryRequestParams } from "@/features/dashboard/industry_request/request-table/use-industry_request-params";
import { usePaginatedPrefetch } from "@/hooks/use-paginated-prefetch";
import { createGetRequest } from "@/lib/axios.utils";
import { ApiPaginatedResponse } from "@/types/interfaces";
import {
  IndustryRequestOfficeResponse,
  IndustryRequestStats,
} from "@/types/interfaces.industry_requests";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { industryRequestOfficeKeys } from "./keys";
import { industryRequestOfficeUrls } from "./urls";

export const getIndustryRequestOfficeList = createGetRequest<
  ApiPaginatedResponse<
    IndustryRequestOfficeResponse,
    undefined,
    IndustryRequestStats
  >
>(industryRequestOfficeUrls.base());

export const useGetIndustryRequestOfficeList = () => {
  const queryClient = useQueryClient();
  const { params } = useIndustryRequestParams();

  const query = useQuery({
    queryKey: industryRequestOfficeKeys.list(params),
    queryFn: () => getIndustryRequestOfficeList(params),
    placeholderData: (prev) => prev,
  });

  usePaginatedPrefetch({
    queryClient,
    baseKey: industryRequestOfficeKeys.list().slice(0, -1),
    queryFn: getIndustryRequestOfficeList,
    params,
    links: query.data?.pagination.links,
    isPlaceholderData: query.isPlaceholderData,
  });

  return query;
};
