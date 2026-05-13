import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/utils.axios";
import { IndustryDetailResponse } from "@/types/interfaces.industry";
import { useQuery } from "@tanstack/react-query";
import { industryUrls } from "./urls";
import { industryKeys } from "./keys";

export const getIndustryDetail = async (id: number) =>
  safeApiRequest(api.get<IndustryDetailResponse>(industryUrls.byId(id)));

export const useGetIndustryDetail = (id: number) => {
  return useQuery({
    queryKey: industryKeys.detail(id),
    queryFn: () => getIndustryDetail(id),
    enabled: !!id,
  });
};
