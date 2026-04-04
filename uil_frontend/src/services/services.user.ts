import api, { safeApiRequest } from "@/lib/axios";
import { User } from "@/types/interfaces.user";
import { cache } from "react";

export const getMe = cache(async () =>
  safeApiRequest(api.get<User>("/users/me")),
);
