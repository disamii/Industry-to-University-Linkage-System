import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { IndustryResponse } from "@/types/interfaces.industry";
import { useQuery } from "@tanstack/react-query";
import { industryKeys } from "./keys";
import { industryUrls } from "./urls";

export const getIndustryDetail = (id: string) => {
  return safeApiRequest(api.get<IndustryResponse>(industryUrls.byId(id)));
};

export const useGetIndustryDetail = (id: string) => {
  return useQuery({
    queryKey: industryKeys.detail(id),
    queryFn: () => getIndustryDetail(id),
  });
};
