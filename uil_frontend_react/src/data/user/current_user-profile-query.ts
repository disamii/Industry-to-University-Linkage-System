import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { useAuthStore } from "@/store/useAuthStore";
import { UserProfile } from "@/types/interfaces.user";
import { useQuery } from "@tanstack/react-query";
import { userKeys } from "./keys";
import { userUrls } from "./urls";

export const getMe = (token?: string) =>
  safeApiRequest(
    api.get<UserProfile>(userUrls.profile(), {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }),
  );

export const useGetMe = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: () => getMe(),
    enabled: !!accessToken,
  });
};
