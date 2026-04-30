import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { IndustryRequestResponse } from "@/types/interfaces.industry_requests";
import { useQuery } from "@tanstack/react-query";
import { industryRequestKeys } from "./keys";
import { industryRequestUrls } from "./urls";

export const getIndustryRequestDetail = (id: string) => {
  return safeApiRequest(
    api.get<IndustryRequestResponse>(industryRequestUrls.byId(id)),
  );
};

export const useGetIndustryRequestDetail = (id: string) => {
  return useQuery({
    queryKey: industryRequestKeys.detail(id),
    queryFn: () => getIndustryRequestDetail(id),
  });
};
