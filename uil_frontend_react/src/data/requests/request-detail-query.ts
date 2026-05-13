import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/utils.axios";
import { RequestDetailResponse } from "@/types/interfaces.requests";
import { useQuery } from "@tanstack/react-query";
import { industryRequestKeys } from "./industry/keys";
import { industryRequestUrls } from "./industry/urls";

export const getRequestDetail = (id: number) => {
  return safeApiRequest(
    api.get<RequestDetailResponse>(industryRequestUrls.byId(id)),
  );
};

export const useGetRequestDetail = (id: number) => {
  return useQuery({
    queryKey: industryRequestKeys.detail(id),
    queryFn: () => getRequestDetail(id),
    enabled: !!id,
  });
};
