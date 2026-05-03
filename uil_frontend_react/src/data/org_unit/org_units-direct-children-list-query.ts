import { createGetRequest } from "@/lib/axios.utils";
import { ApiPaginatedResponse } from "@/types/interfaces";
import {
  OrgUnitDirectChildrenListParams,
  OrgUnitResponse,
} from "@/types/interfaces.org_units";
import { useQuery } from "@tanstack/react-query";
import { orgUnitKeys } from "./keys";
import { orgUnitUrls } from "./urls";

export const getOrgUnitDirectChildrenList = createGetRequest<
  ApiPaginatedResponse<OrgUnitResponse>
>(orgUnitUrls.direct_children());

export const useGetOrgUnitDirectChildrenList = (
  params?: OrgUnitDirectChildrenListParams,
  enabled = true,
) =>
  useQuery({
    queryKey: orgUnitKeys.direct_children_list(params),
    queryFn: () => getOrgUnitDirectChildrenList(params),
    enabled,
    placeholderData: (previousData) => previousData,
  });
