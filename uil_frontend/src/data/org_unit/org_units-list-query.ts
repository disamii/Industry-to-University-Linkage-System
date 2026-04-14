import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { useQuery } from "@tanstack/react-query";
import { ApiPaginatedResponse } from "@/types/interfaces";
import { orgUnitUrls } from "./urls";
import { orgUnitKeys } from "./keys";
import { OrgUnitResponse } from "@/types/interfaces.org_units";

export const getOrgUnitsList = () => {
  return safeApiRequest(
    api.get<ApiPaginatedResponse<OrgUnitResponse[]>>(orgUnitUrls.base()),
  );
};

export const useGetOrgUnitsList = () => {
  return useQuery({
    queryKey: orgUnitKeys.list(),
    queryFn: getOrgUnitsList,
  });
};
