import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { IndustryRequestDetailOfficeResponse } from "@/types/interfaces.industry_requests";
import { useQuery } from "@tanstack/react-query";
import { industryRequestOfficeKeys } from "./keys";
import { industryRequestOfficeUrls } from "./urls";

export const getIndustryRequestOfficeDetail = (id: number) => {
  return safeApiRequest(
    api.get<IndustryRequestDetailOfficeResponse>(
      industryRequestOfficeUrls.byId(id),
    ),
  );
};

export const useGetIndustryRequestOfficeDetail = (id: number) => {
  return useQuery({
    queryKey: industryRequestOfficeKeys.detail(id),
    queryFn: () => getIndustryRequestOfficeDetail(id),
  });
};
