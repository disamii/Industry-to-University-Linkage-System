import { createGetRequest } from "@/lib/axios.utils";
import { ApiPaginatedResponse } from "@/types/interfaces";
import {
  IndustryRequestMineParams,
  IndustryRequestMineResponse,
} from "@/types/interfaces.industry_requests";
import { useQuery } from "@tanstack/react-query";
import { industryRequestKeys } from "./keys";
import { industryRequestUrls } from "./urls";

export const getIndustryRequestMineList = createGetRequest<
  ApiPaginatedResponse<IndustryRequestMineResponse>
>(industryRequestUrls.mine());

export const useGetIndustryRequestMineList = (
  params?: IndustryRequestMineParams,
) => {
  return useQuery({
    queryKey: industryRequestKeys.mine(params),
    queryFn: () => getIndustryRequestMineList(params),
  });
};
