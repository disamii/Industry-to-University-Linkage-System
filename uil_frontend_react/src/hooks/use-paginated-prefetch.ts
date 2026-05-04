import { QueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type PrefetchConfig<TParams> = {
  queryClient: QueryClient;
  baseKey: unknown[];
  queryFn: (params: TParams) => Promise<any>;
  params: TParams;
  links?: { next: string | null; previous: string | null };
  isPlaceholderData: boolean;
};

export const usePaginatedPrefetch = <TParams extends { page: number }>(
  config: PrefetchConfig<TParams>,
) => {
  const { queryClient, baseKey, queryFn, params, links, isPlaceholderData } =
    config;

  useEffect(() => {
    if (!links) return;

    // Skip if it's a placholder data
    if (isPlaceholderData) return;

    const hasNextPage = links.next !== null;
    const hasPrevPage = links.previous !== null;

    const prefetch = (targetPage: number) => {
      if (!hasPrevPage && !hasNextPage) return;

      const nextParams = { ...params, page: targetPage };
      const queryKey = [...baseKey, nextParams];

      const existing = queryClient.getQueryData(queryKey);
      if (existing) return;

      queryClient.prefetchQuery({
        queryKey,
        queryFn: () => queryFn(nextParams),
        staleTime: 1000 * 60 * 5, // 5 min cache
      });
    };

    if (hasNextPage) prefetch(params.page + 1);
    if (hasPrevPage) prefetch(params.page - 1);
  }, [queryClient, baseKey, queryFn, params, links]);
};
