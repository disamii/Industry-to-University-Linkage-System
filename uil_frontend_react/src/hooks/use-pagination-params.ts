import { useMemo } from "react";
import { useUrlParams } from "./use-url-params";
import { PAGE_SIZE } from "@/lib/constants";

export type PaginationParams = {
  page: number;
  page_size: number;
};

export const defaultPaginationParams: PaginationParams = {
  page: 1,
  page_size: PAGE_SIZE,
};

type Props = {
  namespace: string;
};

const usePaginationParams = ({ namespace }: Props) => {
  const { getParam, setParams, removeParams, clearAllParams } =
    useUrlParams<PaginationParams>(defaultPaginationParams, namespace);

  const page = getParam("page");
  const page_size = getParam("page_size");

  const params: PaginationParams = useMemo(
    () => ({
      page,
      page_size,
    }),
    [page, page_size],
  );

  return { params, setParams, removeParams, clearAllParams };
};

export default usePaginationParams;
