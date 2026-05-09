import { useMemo } from "react";
import { useUrlParams } from "./use-url-params";

export type TabParams = {
  tab: string;
};

export const defaultTabParams: TabParams = {
  tab: "",
};

const useTabParams = () => {
  const { getParam, setParams, removeParams, clearAllParams } =
    useUrlParams<TabParams>(defaultTabParams);

  const tab = getParam("tab");

  const params: TabParams = useMemo(
    () => ({
      tab,
    }),
    [tab],
  );

  return { params, setParams, removeParams, clearAllParams };
};

export default useTabParams;
