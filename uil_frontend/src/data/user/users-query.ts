import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { useQuery } from "@tanstack/react-query";
import { userKeys } from "./keys";
import { userUrls } from "./urls";
import { User } from "@/types/interfaces.user";
import { ApiPaginatedResponse } from "@/types/interfaces";

export const getUsers = () =>
  safeApiRequest(api.get<ApiPaginatedResponse<User[]>>(userUrls.base()));

export const useGetUsers = () => {
  return useQuery({
    queryKey: userKeys.all(),
    queryFn: getUsers,
  });
};
