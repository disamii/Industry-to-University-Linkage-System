import api from "@/lib/axios";
import { safeApiRequest } from "@/lib/utils.axios";
import { PostDetailResponse } from "@/types/interfaces.posts";
import { useQuery } from "@tanstack/react-query";
import { postUrls } from "./urls";
import { postKeys } from "./keys";

export const getPostDetail = async (id: number) =>
  safeApiRequest(api.get<PostDetailResponse>(postUrls.byId(id)));

export const useGetPostDetail = (id: number) => {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => getPostDetail(id),
    enabled: !!id,
  });
};
