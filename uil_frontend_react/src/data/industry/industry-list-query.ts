import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { IndustryResponse } from "@/types/interfaces.industry";
import { useQuery } from "@tanstack/react-query";
import { industryKeys } from "./keys";
import { industryUrls } from "./urls";
import { ApiPaginatedResponse } from "@/types/interfaces";

export const getIndustryList = () => {
  return safeApiRequest(
    api.get<ApiPaginatedResponse<IndustryResponse[]>>(industryUrls.base()),
  );
};

export const useGetIndustryList = () => {
  return useQuery({
    queryKey: industryKeys.list(),
    queryFn: getIndustryList,
  });
};
