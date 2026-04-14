import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { IndustryRequestResponseForAdmin } from "@/types/interfaces.industry_requests";
import { useQuery } from "@tanstack/react-query";
import { industryRequestKeys } from "./keys";
import { industryRequestUrls } from "./urls";

export const getIndustryRequestDetailForAdmin = (id: string) => {
  return safeApiRequest(
    api.get<IndustryRequestResponseForAdmin>(industryRequestUrls.adminById(id)),
  );
};

export const useGetIndustryRequestDetailForAdmin = (id: string) => {
  return useQuery({
    queryKey: industryRequestKeys.adminDetail(id),
    queryFn: () => getIndustryRequestDetailForAdmin(id),
  });
};
