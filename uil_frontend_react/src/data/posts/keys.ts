import { PostParams } from "@/data/posts/use-post-params";

export const postKeys = {
  all: () => ["posts"] as const,
  list: (params?: PostParams) => [...postKeys.all(), "list", params] as const,
  detail: (id: number) => [...postKeys.all(), "detail", id] as const,
};
