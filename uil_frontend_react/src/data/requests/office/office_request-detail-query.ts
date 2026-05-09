import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { RequestDetailResponse } from "@/types/interfaces.requests";
import { useQuery } from "@tanstack/react-query";
import { industryRequestOfficeKeys } from "./keys";
import { industryRequestOfficeUrls } from "./urls";

export const getOfficeRequestDetail = (id: number) => {
  return safeApiRequest(
    api.get<RequestDetailResponse>(industryRequestOfficeUrls.byId(id)),
  );
};

export const useGetOfficeRequestDetail = (id: number) => {
  return useQuery({
    queryKey: industryRequestOfficeKeys.detail(id),
    queryFn: () => getOfficeRequestDetail(id),
  });
};
