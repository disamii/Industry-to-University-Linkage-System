import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { IndustryRequestResponse } from "@/types/interfaces.industry_requests";
import { useQuery } from "@tanstack/react-query";
import { industryRequestKeys } from "./keys";
import { industryRequestUrls } from "./urls";
import { ApiPaginatedResponse } from "@/types/interfaces";

export const getIndustryRequestList = () => {
  return safeApiRequest(
    api.get<ApiPaginatedResponse<IndustryRequestResponse[]>>(
      industryRequestUrls.base(),
    ),
  );
};

export const useGetIndustryRequestList = () => {
  return useQuery({
    queryKey: industryRequestKeys.list(),
    queryFn: getIndustryRequestList,
  });
};
