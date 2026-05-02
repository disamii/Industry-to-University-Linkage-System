import { useSearchParams } from "react-router-dom";

export const useUrlParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Get all current params as a plain object
   */
  const params = Object.fromEntries(searchParams.entries());

  /**
   * Update or add multiple parameters while preserving others
   */
  const setParams = (
    newParams: Record<string, string | number | undefined | null>,
  ) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(value));
      }
    });

    setSearchParams(nextParams);
  };

  /**
   * Remove specific keys from the URL
   */
  const removeParams = (keys: string[]) => {
    const nextParams = new URLSearchParams(searchParams);
    keys.forEach((key) => nextParams.delete(key));
    setSearchParams(nextParams);
  };

  /**
   * Clear all parameters entirely
   */
  const clearAllParams = () => {
    setSearchParams({});
  };

  /**
   * Helper to get a single param with a fallback
   */
  const getParam = (key: string, defaultValue: string = "") => {
    return searchParams.get(key) || defaultValue;
  };

  return {
    params,
    getParam,
    setParams,
    removeParams,
    clearAllParams,
    searchParams, // Exposed for raw access if needed
  };
};
