import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { OrgUnitResponse } from "@/types/interfaces.org_units";
import { useQuery } from "@tanstack/react-query";
import { orgUnitUrls } from "./urls";
import { orgUnitKeys } from "./keys";

export const getOrgUnitDetail = (id?: number) => {
  if (!id) {
    throw new Error("ID is required");
  }

  return safeApiRequest(api.get<OrgUnitResponse>(orgUnitUrls.byId(id)));
};
export const useGetOrgUnitDetail = (id?: number) => {
  return useQuery({
    queryKey: orgUnitKeys.detail(id),
    queryFn: () => getOrgUnitDetail(id),
    enabled: !!id,
  });
};
