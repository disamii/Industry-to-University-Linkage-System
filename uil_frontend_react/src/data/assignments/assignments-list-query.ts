import { usePaginatedPrefetch } from "@/hooks/use-paginated-prefetch";
import { createGetRequest } from "@/lib/axios.utils";
import { ApiPaginatedResponse } from "@/types/interfaces";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { assignmentsUrls } from "./urls";
import { assignmentsKeys } from "./keys";
import { AssignmentResponse } from "@/types/interfaces.assignments";
import { useAssignmentParams } from "@/features/dashboard/office/assignments/assignments-params";

export const getAssignmentsList = createGetRequest<
  ApiPaginatedResponse<AssignmentResponse>
>(assignmentsUrls.base());

export const useAssignmentsList = () => {
  const queryClient = useQueryClient();
  const { params } = useAssignmentParams();

  const query = useQuery({
    queryKey: assignmentsKeys.list(params),
    queryFn: () => getAssignmentsList(params),
    placeholderData: (prev) => prev,
  });

  usePaginatedPrefetch({
    queryClient,
    baseKey: assignmentsKeys.list().slice(0, -1),
    queryFn: getAssignmentsList,
    params,
    links: query.data?.pagination.links,
    isPlaceholderData: query.isPlaceholderData,
  });

  return query;
};
