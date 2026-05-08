import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/axios.utils";
import { UserProfile } from "@/types/interfaces.user";
import { userUrls } from "./urls";

export const getMe = (token?: string) =>
  safeApiRequest(
    api.get<UserProfile>(userUrls.profile(), {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }),
  );
