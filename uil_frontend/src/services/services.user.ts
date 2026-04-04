import apiServer from "@/lib/axios";
import { User } from "@/types/interfaces.user";
import { cache } from "react";

export const getMe = cache(async () => {
  try {
    const response = await apiServer.get<User>("/users/me");
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      return null;
    }
    console.error("Profile fetch failed:", error.message);
    return null;
  }
});
