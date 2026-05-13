import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/utils.axios";
import { AssignmentDetailResponse } from "@/types/interfaces.assignments";
import { useQuery } from "@tanstack/react-query";
import { assignmentUrls } from "./urls";
import { assignmentKeys } from "./keys";

export const getAssignmentDetail = (id: number) => {
  return safeApiRequest(
    api.get<AssignmentDetailResponse>(assignmentUrls.byId(id)),
  );
};

export const useGetAssignmentDetail = (id: number) => {
  return useQuery({
    queryKey: assignmentKeys.detail(id),
    queryFn: () => getAssignmentDetail(id),
    enabled: !!id,
  });
};
