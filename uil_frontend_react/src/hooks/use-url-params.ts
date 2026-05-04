import { useSearchParams } from "react-router-dom";

export const useUrlParams = <T extends object>(defaults: Partial<T>) => {
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Get all current params as a plain object
   */
  const params = Object.fromEntries(searchParams.entries()) as Partial<
    Record<keyof T, string>
  >;

  /**
   * Update or add multiple parameters while preserving others
   */
  const setParams = (
    newParams: Partial<
      Record<keyof T, string | number | boolean | null | undefined>
    >,
  ) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(newParams).forEach(([key, value]) => {
      const defaultValue = defaults?.[key as keyof T];

      // Check if value is "empty" OR matches the default value
      const isDefault =
        value !== undefined && String(value) === String(defaultValue);
      const isEmpty = value === undefined || value === null || value === "";

      if (isEmpty || isDefault) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(value));
      }
    });

    // Reset pagination logic:
    // If any key other than 'page' or 'page_size' is being updated,
    // and 'page' currently exists in the URL, reset it to 1.
    const keysUpdating = Object.keys(newParams);
    const isUpdatingFilters = keysUpdating.some(
      (k) => k !== "page" && k !== "ordering",
    );

    if (isUpdatingFilters && nextParams.has("page")) {
      nextParams.set("page", "1");
    }

    setSearchParams(nextParams);
  };

  /**
   * Remove specific keys from the URL
   */
  const removeParams = (keys: (keyof T)[]) => {
    const nextParams = new URLSearchParams(searchParams);
    keys.forEach((key) => nextParams.delete(key.toString()));

    if (nextParams.has("page")) nextParams.set("page", "1");

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
  const getParam = <K extends keyof T>(key: K): T[K] => {
    const value = searchParams.get(String(key));
    const defaultValue = defaults?.[key];

    if (value === null) return defaultValue as T[K];

    // Heuristic parsing
    if (typeof defaultValue === "number") return Number(value) as T[K];
    if (typeof defaultValue === "boolean") return (value === "true") as T[K];

    return value as T[K];
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
