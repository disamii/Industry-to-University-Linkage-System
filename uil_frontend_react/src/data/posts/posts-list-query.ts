import { usePaginatedPrefetch } from "@/hooks/use-paginated-prefetch";
import { createGetRequest } from "@/lib/axios.utils";
import { ApiPaginatedResponse } from "@/types/interfaces";
import { PostResponse } from "@/types/interfaces.posts";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { postUrls } from "./urls";
import { usePostParams } from "@/data/posts/use-post-params";
import { postKeys } from "./keys";

export const getPostsList = createGetRequest<
  ApiPaginatedResponse<PostResponse>
>(postUrls.base());

export const useGetPostsList = () => {
  const queryClient = useQueryClient();
  const { params } = usePostParams();

  const query = useQuery({
    queryKey: postKeys.list(params),
    queryFn: () => getPostsList(params),
    placeholderData: (prev) => prev,
  });

  usePaginatedPrefetch({
    queryClient,
    baseKey: postKeys.list().slice(0, -1),
    queryFn: getPostsList,
    params,
    links: query.data?.pagination.links,
    isPlaceholderData: query.isPlaceholderData,
  });

  return query;
};
