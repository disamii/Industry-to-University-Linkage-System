import { ApiPaginatedResponse } from "@/types/interfaces";
import { UserParams, UserProfile } from "@/types/interfaces.user";
import { useQuery } from "@tanstack/react-query";
import { userKeys } from "./keys";

import { createGetRequest } from "@/lib/axios.utils";
import { userUrls } from "./urls";

export const defaultUserParams: UserParams = { search: "" };

export const getUsers = createGetRequest<ApiPaginatedResponse<UserProfile>>(
  userUrls.base(),
);

export const useGetUsers = (params?: UserParams) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => getUsers(params),
  });
};
