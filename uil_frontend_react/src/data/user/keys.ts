import { UserParams } from "@/types/interfaces.user";

export const userKeys = {
  all: () => ["user"] as const,
  list: (params?: UserParams) => [...userKeys.all(), "list", params] as const,
};
