import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { ApiPaginatedResponse } from "@/types/interfaces";
import { IndustryRequestResponseForAdmin } from "@/types/interfaces.industry_requests";
import { useQuery } from "@tanstack/react-query";
import { industryRequestKeys } from "./keys";
import { industryRequestUrls } from "./urls";

export const getIndustryRequestListForAdmin = () => {
  return safeApiRequest(
    api.get<ApiPaginatedResponse<IndustryRequestResponseForAdmin[]>>(
      industryRequestUrls.adminAll(),
    ),
  );
};

export const useGetIndustryRequestListForAdmin = () => {
  return useQuery({
    queryKey: industryRequestKeys.adminList(),
    queryFn: getIndustryRequestListForAdmin,
  });
};
