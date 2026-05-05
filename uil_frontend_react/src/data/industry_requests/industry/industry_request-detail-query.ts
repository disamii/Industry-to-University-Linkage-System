import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { IndustryRequestDetailResponse } from "@/types/interfaces.industry_requests";
import { useQuery } from "@tanstack/react-query";
import { industryRequestKeys } from "./keys";
import { industryRequestUrls } from "./urls";

export const getIndustryRequestDetail = (id: number) => {
  return safeApiRequest(
    api.get<IndustryRequestDetailResponse>(industryRequestUrls.byId(id)),
  );
};

export const useGetIndustryRequestDetail = (id: number) => {
  return useQuery({
    queryKey: industryRequestKeys.detail(id),
    queryFn: () => getIndustryRequestDetail(id),
  });
};
