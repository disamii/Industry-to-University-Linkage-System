import { createGetRequest } from "@/lib/utils.axios";
import { IndustryResponse } from "@/types/interfaces.industry";
import { useQuery } from "@tanstack/react-query";
import { industryKeys } from "./keys";
import { industryUrls } from "./urls";

export const getIndustryMe = createGetRequest<IndustryResponse>(
  industryUrls.me(),
);

export const useGetIndustryMe = () => {
  const query = useQuery({
    queryKey: industryKeys.me(),
    queryFn: () => getIndustryMe(),
  });

  return query;
};
