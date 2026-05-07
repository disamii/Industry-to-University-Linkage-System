import { ApiPaginatedResponse } from "@/types/interfaces";
import { UserProfile } from "@/types/interfaces.user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "./keys";

import { createGetRequest } from "@/lib/axios.utils";
import { userUrls } from "./urls";

import { usePaginatedPrefetch } from "@/hooks/use-paginated-prefetch";
import { useUserParams } from "./use-user-params";

export const getUsers = createGetRequest<ApiPaginatedResponse<UserProfile>>(
  userUrls.base(),
);

export const useGetUsers = () => {
  const queryClient = useQueryClient();
  const { params } = useUserParams();

  const query = useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => getUsers(params),
    placeholderData: (prev) => prev,
  });

  usePaginatedPrefetch({
    queryClient,
    baseKey: userKeys.list().slice(0, -1),
    queryFn: getUsers,
    params,
    links: query.data?.pagination.links,
    isPlaceholderData: query.isPlaceholderData,
  });

  return query;
};
