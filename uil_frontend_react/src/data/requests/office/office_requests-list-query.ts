import { useRequestParams } from "@/data/requests/use-request-params";
import { usePaginatedPrefetch } from "@/hooks/use-paginated-prefetch";
import { createGetRequest } from "@/lib/utils.axios";
import { ApiPaginatedResponse } from "@/types/interfaces";
import {
  OfficeRequestResponse,
  RequestStats,
} from "@/types/interfaces.requests";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { industryRequestOfficeKeys } from "./keys";
import { industryRequestOfficeUrls } from "./urls";

export const getIndustryRequestOfficeList = createGetRequest<
  ApiPaginatedResponse<OfficeRequestResponse, undefined, RequestStats>
>(industryRequestOfficeUrls.base());

export const useGetIndustryRequestOfficeList = (enabled: boolean) => {
  const queryClient = useQueryClient();
  const { params } = useRequestParams();

  const query = useQuery({
    queryKey: industryRequestOfficeKeys.list(params),
    queryFn: () => getIndustryRequestOfficeList(params),
    placeholderData: (prev) => prev,
    enabled,
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
