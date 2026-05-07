import { createGetRequest } from "@/lib/axios.utils";
import { ApiPaginatedResponse } from "@/types/interfaces";
import { IndustryResponse } from "@/types/interfaces.industry";
import { useQuery } from "@tanstack/react-query";
import { industryKeys } from "./keys";
import { industryUrls } from "./urls";
import { IndustryParams } from "@/features/dashboard/office/industry-management/use-industry-params";

export const getIndustryList = createGetRequest<
  ApiPaginatedResponse<IndustryResponse>
>(industryUrls.base());

export const useGetIndustryList = (params?: IndustryParams) => {
  return useQuery({
    queryKey: industryKeys.list(params),
    queryFn: () => getIndustryList(params),
  });
};
