import { useIndustryParams } from "@/data/industry/use-industry-params";
import { createGetRequest } from "@/lib/utils.axios";
import { ApiPaginatedResponse } from "@/types/interfaces";
import { IndustryResponse, IndustryStats } from "@/types/interfaces.industry";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { industryKeys } from "./keys";
import { industryUrls } from "./urls";
import { usePaginatedPrefetch } from "@/hooks/use-paginated-prefetch";

export const getIndustryList = createGetRequest<
  ApiPaginatedResponse<IndustryResponse, undefined, IndustryStats>
>(industryUrls.base());

export const useGetIndustryList = (enabled?: boolean) => {
  const queryClient = useQueryClient();
  const { params } = useIndustryParams();

  const query = useQuery({
    queryKey: industryKeys.list(params),
    queryFn: () => getIndustryList(params),
    placeholderData: (prev) => prev,
    enabled,
  });

  usePaginatedPrefetch({
    queryClient,
    baseKey: industryKeys.list().slice(0, -1),
    queryFn: getIndustryList,
    params,
    links: query.data?.pagination.links,
    isPlaceholderData: query.isPlaceholderData,
  });

  return query;
};
