import { usePaginatedPrefetch } from "@/hooks/use-paginated-prefetch";
import { createGetRequest } from "@/lib/axios.utils";
import { ApiPaginatedResponse } from "@/types/interfaces";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { assignmentUrls } from "./urls";
import { assignmentKeys } from "./keys";
import {
  AssignmentResponse,
  AssignmentStats,
} from "@/types/interfaces.assignments";
import { useAssignmentParams } from "@/data/assignments/use-assignment-params";

export const getAssignmentsList = createGetRequest<
  ApiPaginatedResponse<AssignmentResponse, undefined, AssignmentStats>
>(assignmentUrls.base());

export const useGetAssignmentsList = () => {
  const queryClient = useQueryClient();
  const { params } = useAssignmentParams();

  const query = useQuery({
    queryKey: assignmentKeys.list(params),
    queryFn: () => getAssignmentsList(params),
    placeholderData: (prev) => prev,
  });

  usePaginatedPrefetch({
    queryClient,
    baseKey: assignmentKeys.list().slice(0, -1),
    queryFn: getAssignmentsList,
    params,
    links: query.data?.pagination.links,
    isPlaceholderData: query.isPlaceholderData,
  });

  return query;
};
