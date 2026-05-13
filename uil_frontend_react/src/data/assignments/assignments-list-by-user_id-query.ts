import { usePaginatedPrefetch } from "@/hooks/use-paginated-prefetch";
import { createGetRequest } from "@/lib/utils.axios";
import { ApiPaginatedResponse } from "@/types/interfaces";

import {
  AssignmentParams,
  useAssignmentParams,
} from "@/data/assignments/use-assignment-params";
import {
  AssignmentResponse,
  AssignmentStats,
} from "@/types/interfaces.assignments";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { assignmentKeys } from "./keys";
import { assignmentUrls } from "./urls";

export const getAssignmentsListByUserId = (
  user_id?: number,
  params?: AssignmentParams,
) => {
  if (!user_id) throw new Error("No User Id Found");

  const getFn = createGetRequest<
    ApiPaginatedResponse<AssignmentResponse, undefined, AssignmentStats>
  >(assignmentUrls.by_user_id(user_id));

  return getFn(params);
};
export const useGetAssignmentsListByUserId = (user_id?: number) => {
  const queryClient = useQueryClient();
  const { params } = useAssignmentParams();

  const query = useQuery({
    queryKey: assignmentKeys.list_by_user_id(user_id, params),
    queryFn: () => getAssignmentsListByUserId(user_id, params),
    placeholderData: (prev) => prev,
    enabled: !!user_id,
  });

  usePaginatedPrefetch({
    queryClient,
    baseKey: assignmentKeys.list_by_user_id(user_id).slice(0, -1),
    queryFn: (params) => getAssignmentsListByUserId(user_id, params),
    params,
    links: query.data?.pagination.links,
    isPlaceholderData: query.isPlaceholderData,
  });

  return query;
};
