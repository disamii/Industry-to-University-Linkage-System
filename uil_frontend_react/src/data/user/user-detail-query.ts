import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { UserProfile } from "@/types/interfaces.user";
import { useQuery } from "@tanstack/react-query";
import { userKeys } from "./keys";
import { userUrls } from "./urls";

export const getUserDetail = (id: string) =>
  safeApiRequest(api.get<UserProfile>(userUrls.byId(id)));

export const useGetUserDetail = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserDetail(id),
  });
};
