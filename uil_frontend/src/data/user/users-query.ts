import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { useQuery } from "@tanstack/react-query";
import { userKeys } from "./keys";
import { userUrls } from "./urls";
import { User } from "@/types/interfaces.user";

export const getUsers = () => safeApiRequest(api.get<User>(userUrls.base()));

export const useGetUsers = () => {
  return useQuery({
    queryKey: userKeys.all(),
    queryFn: getUsers,
  });
};
