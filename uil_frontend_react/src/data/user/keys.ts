import { UserParams } from "./use-user-params";

export const userKeys = {
  all: () => ["user"] as const,
  list: (params?: UserParams) => [...userKeys.all(), "list", params] as const,
};
