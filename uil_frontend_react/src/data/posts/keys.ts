import { PostParams } from "@/features/dashboard/office/posts/post-params";

export const postKeys = {
  all: () => ["posts"] as const,
  list: (params?: PostParams) => [...postKeys.all(), "list", params] as const,
};
