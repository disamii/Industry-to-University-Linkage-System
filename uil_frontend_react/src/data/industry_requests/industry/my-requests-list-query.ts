import {
  MyRequestParams,
  useRequestParams,
} from "@/data/industry_requests/use-request-params";
import { usePaginatedPrefetch } from "@/hooks/use-paginated-prefetch";
import { createGetRequest } from "@/lib/axios.utils";
import { ApiPaginatedResponse } from "@/types/interfaces";
import { MyRequestResponse, RequestStats } from "@/types/interfaces.requests";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { industryRequestKeys } from "./keys";
import { industryRequestUrls } from "./urls";

export const getMyRequestsList = createGetRequest<
  ApiPaginatedResponse<MyRequestResponse, undefined, RequestStats>
>(industryRequestUrls.mine());

export const useGetMyRequestsList = ({
  entity,
  direction,
}: MyRequestParams) => {
  const queryClient = useQueryClient();
  const { params } = useRequestParams(entity, direction);

  const query = useQuery({
    queryKey: industryRequestKeys.mine(params),
    queryFn: () => getMyRequestsList(params),
    placeholderData: (prev) => prev,
  });

  usePaginatedPrefetch({
    queryClient,
    baseKey: industryRequestKeys.mine().slice(0, -1),
    queryFn: getMyRequestsList,
    params,
    links: query.data?.pagination.links,
    isPlaceholderData: query.isPlaceholderData,
  });

  return query;
};
