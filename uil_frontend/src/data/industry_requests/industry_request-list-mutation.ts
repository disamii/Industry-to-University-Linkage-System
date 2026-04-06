import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { IndustryRequestResponse } from "@/types/interfaces.industry_requests";
import { useQuery } from "@tanstack/react-query";
import { industryRequestKeys } from "./keys";
import { industryRequestUrls } from "./urls";

export const getIndustryRequestList = () => {
  return safeApiRequest(
    api.get<IndustryRequestResponse[]>(industryRequestUrls.base()),
  );
};

export const useGetIndustryRequestList = () => {
  return useQuery({
    queryKey: industryRequestKeys.list(),
    queryFn: getIndustryRequestList,
  });
};
