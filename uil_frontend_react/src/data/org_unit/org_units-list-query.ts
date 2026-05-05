import { createGetRequest } from "@/lib/axios.utils";
import { ApiPaginatedResponse } from "@/types/interfaces";
import {
  OrgUnitListParams,
  OrgUnitResponse,
} from "@/types/interfaces.org_units";
import { useQuery } from "@tanstack/react-query";
import { orgUnitKeys } from "./keys";
import { orgUnitUrls } from "./urls";

export const getOrgUnitsList = createGetRequest<
  ApiPaginatedResponse<OrgUnitResponse>
>(orgUnitUrls.base());

export const useGetOrgUnitsList = (
  params?: OrgUnitListParams,
  enabled = true,
) =>
  useQuery({
    queryKey: orgUnitKeys.list(params),
    queryFn: () => getOrgUnitsList(params),
    enabled,
  });
