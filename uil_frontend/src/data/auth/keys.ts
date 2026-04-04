export const authKeys = {
  all: () => ["auth"] as const,
  // login: () => [...authKeys.all(), "signin"] as const,
};
