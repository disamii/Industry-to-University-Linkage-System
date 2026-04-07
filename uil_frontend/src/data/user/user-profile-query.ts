import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { useQuery } from "@tanstack/react-query";
import { userKeys } from "./keys";
import { userUrls } from "./urls";
import { User } from "@/types/interfaces.user";

export const getMe = () => safeApiRequest(api.get<User>(userUrls.profile()));

export const useGetMe = () => {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: getMe,
  });
};
