import { Spinner } from "@/components/reusable/spinner";
import { UseQueryResult } from "@tanstack/react-query";
import { AlertCircle, RefreshCcw, SearchX } from "lucide-react";
import React from "react";

interface QueryStateProps<T> {
  query: UseQueryResult<T>;
  children: (data: T) => React.ReactNode;
  emptyMessage?: string;
  loadingMessage?: string;
}

export const QueryState = <T,>({
  query,
  children,
  emptyMessage = "No records found",
  loadingMessage = "Loading data...",
}: QueryStateProps<T>) => {
  const { isLoading, isError, error, data, refetch } = query;

  // 1. LOADING STATE
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center p-8 w-full min-h-75 transition-all">
        <div className="relative flex justify-center items-center">
          <Spinner size="lg" className="text-primary animate-spin" />
          <div className="-z-10 absolute border-4 border-blue-50 rounded-full w-10 h-10"></div>
        </div>
        <p className="mt-4 font-medium text-slate-500 text-sm animate-pulse">
          {loadingMessage}
        </p>
      </div>
    );
  }

  // 2. ERROR STATE
  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center bg-red-50/30 p-8 border border-red-100 rounded-2xl w-full min-h-75 text-center">
        <div className="bg-red-100 p-3 rounded-full text-red-600">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="mt-4 font-semibold text-slate-900 text-lg">
          {error?.message || "Something went wrong"}
        </h3>
        <p className="mt-1 max-w-xs text-slate-500 text-sm">
          We had trouble loading this information.
        </p>
        {refetch && (
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 shadow-sm mt-6 px-4 py-2 border border-slate-200 rounded-lg font-medium text-slate-700 text-sm transition-all"
          >
            <RefreshCcw className="w-4 h-4" /> Retry
          </button>
        )}
      </div>
    );
  }

  // 3. EMPTY STATE LOGIC
  const checkIsEmpty = (val: any): boolean => {
    if (!val) return true;
    if (Array.isArray(val)) return val.length === 0;
    // Safely check for .items if val is an object
    if (typeof val === "object" && "items" in val && Array.isArray(val.items)) {
      return val.items.length === 0;
    }
    return false;
  };

  if (checkIsEmpty(data)) {
    return (
      <div className="flex flex-col justify-center items-center p-8 border-2 border-slate-200 border-dashed rounded-2xl w-full min-h-75 text-center">
        <div className="bg-slate-50 p-4 rounded-2xl text-slate-400">
          <SearchX className="w-10 h-10" />
        </div>
        <h3 className="mt-4 font-semibold text-slate-900 text-sm">
          {emptyMessage}
        </h3>
        <p className="mt-1 text-slate-400 text-xs">
          If you think this is a mistake, contact support.
        </p>
      </div>
    );
  }

  // 4. SUCCESS STATE
  // Since we've checked for loading, error, and empty,
  // 'data' is guaranteed to exist and be populated here.
  return <>{children(data as T)}</>;
};
