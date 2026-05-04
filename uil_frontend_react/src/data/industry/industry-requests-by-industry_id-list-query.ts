import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { IndustryRequestResponse } from "@/types/interfaces.industry_requests";
import { useQuery } from "@tanstack/react-query";
import { ApiPaginatedResponse } from "@/types/interfaces";
import { industryUrls } from "./urls";
import { industryKeys } from "./keys";

export const getIndustryRequestsListByIndustryId = (id: string) => {
  return safeApiRequest(
    api.get<ApiPaginatedResponse<IndustryRequestResponse>>(
      industryUrls.requests(id),
    ),
  );
};

export const useGetIndustryRequestsListByIndustryId = (id: string) => {
  return useQuery({
    queryKey: industryKeys.requests(id),
    queryFn: () => getIndustryRequestsListByIndustryId(id),
  });
};
