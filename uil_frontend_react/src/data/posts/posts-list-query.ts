import { usePaginatedPrefetch } from "@/hooks/use-paginated-prefetch";
import { createGetRequest } from "@/lib/utils.axios";
import { ApiPaginatedResponse } from "@/types/interfaces";
import { PostResponse, PostStats } from "@/types/interfaces.posts";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { postUrls } from "./urls";
import { usePostParams } from "@/data/posts/use-post-params";
import { postKeys } from "./keys";

export const getPostsList = createGetRequest<
  ApiPaginatedResponse<PostResponse, undefined, PostStats>
>(postUrls.base());

export const useGetPostsList = () => {
  const queryClient = useQueryClient();
  const { params } = usePostParams();

  const apiParams = {
    ...params,
    post_type: params.post_type === "All" ? undefined : params.post_type,
  };

  const query = useQuery({
    queryKey: postKeys.list(apiParams),
    queryFn: () => getPostsList(apiParams),
    placeholderData: (prev) => prev,
  });

  usePaginatedPrefetch({
    queryClient,
    baseKey: postKeys.list().slice(0, -1),
    queryFn: getPostsList,
    params: apiParams,
    links: query.data?.pagination.links,
    isPlaceholderData: query.isPlaceholderData,
  });

  return query;
};
