export const userKeys = {
  all: () => ["user"] as const,
  profile: () => [...userKeys.all(), "profile"] as const,
  detail: (id: string) => [...userKeys.all(), "detail", id] as const,
};
