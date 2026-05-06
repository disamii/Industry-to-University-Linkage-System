import { UserParams } from "@/types/interfaces.user";

export const userKeys = {
  all: () => ["user"] as const,
  list: (params?: UserParams) => [...userKeys.all(), "list", params] as const,
  profile: () => [...userKeys.all(), "profile"] as const,
  detail: (id: string) => [...userKeys.all(), "detail", id] as const,
};
