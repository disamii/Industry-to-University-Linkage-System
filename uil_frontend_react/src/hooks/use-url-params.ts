import { useSearchParams } from "react-router-dom";

export const useUrlParams = <T extends object>(
  defaults: Partial<T>,
  namespace?: string,
) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const prefix = namespace ? `${namespace}.` : "";

  const prefixKey = (key: string) => `${prefix}${key}`;
  const unprefixKey = (key: string) =>
    namespace ? key.slice(prefix.length) : key;

  /**
   * Get all current params for this namespace as a plain object
   */
  const params = Object.fromEntries(
    [...searchParams.entries()]
      .filter(([key]) => (namespace ? key.startsWith(prefix) : true))
      .map(([key, value]) => [unprefixKey(key), value]),
  ) as Partial<Record<keyof T, string>>;

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
      const prefixed = prefixKey(key);
      const defaultValue = defaults?.[key as keyof T];

      const isDefault =
        value !== undefined && String(value) === String(defaultValue);
      const isEmpty = value === undefined || value === null || value === "";

      if (isEmpty || isDefault) {
        nextParams.delete(prefixed);
      } else {
        nextParams.set(prefixed, String(value));
      }
    });

    const keysUpdating = Object.keys(newParams);
    const isUpdatingFilters = keysUpdating.some(
      (k) => k !== "page" && k !== "ordering",
    );

    const pageKey = prefixKey("page");
    if (isUpdatingFilters && nextParams.has(pageKey)) {
      nextParams.set(pageKey, "1");
    }

    setSearchParams(nextParams, { replace: true });
  };

  /**
   * Remove specific keys from the URL
   */
  const removeParams = (keys: (keyof T)[]) => {
    const nextParams = new URLSearchParams(searchParams);
    keys.forEach((key) => nextParams.delete(prefixKey(key.toString())));

    const pageKey = prefixKey("page");
    if (nextParams.has(pageKey)) nextParams.set(pageKey, "1");

    setSearchParams(nextParams, { replace: true });
  };

  /**
   * Clear all parameters for this namespace only
   */
  const clearAllParams = () => {
    const nextParams = new URLSearchParams(searchParams);

    if (namespace) {
      // Only delete keys belonging to this namespace
      [...nextParams.keys()]
        .filter((key) => key.startsWith(prefix))
        .forEach((key) => nextParams.delete(key));
      setSearchParams(nextParams, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  /**
   * Helper to get a single param with a fallback
   */
  const getParam = <K extends keyof T>(key: K): T[K] => {
    const value = searchParams.get(prefixKey(String(key)));
    const defaultValue = defaults?.[key];

    if (value === null) return defaultValue as T[K];

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
    searchParams,
  };
};
