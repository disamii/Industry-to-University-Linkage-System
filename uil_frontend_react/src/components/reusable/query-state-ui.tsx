import { UseQueryResult } from "@tanstack/react-query";
import { ReactNode } from "react";
import { Spinner } from "../ui/spinner";
import EmptyState from "./empty-state";
import { ErrorState } from "./error-state";

type QueryStateGateProps<T> = {
  query: UseQueryResult<T, Error>;
  children: ReactNode | ((data: T) => ReactNode);
  checkEmpty: (data: T) => boolean;

  // Optional Props
  loadingComponent?: ReactNode;
  errorComponent?:
    | ReactNode
    | ((error: Error, refetch: () => void) => ReactNode);
  emptyComponent?: ReactNode;
};

export function QueryState<T>({
  query,
  children,
  loadingComponent = <Spinner />,
  emptyComponent = <EmptyState />,
  errorComponent,
  checkEmpty,
}: QueryStateGateProps<T>) {
  const { data, isLoading, isError, error, refetch, isFetching } = query;

  if (isLoading) return <>{loadingComponent}</>;

  if (isError) {
    if (typeof errorComponent === "function") {
      return <>{errorComponent(error, refetch)}</>;
    }

    return errorComponent || <ErrorState error={error} reset={refetch} />;
  }

  if (checkEmpty(data as T)) {
    return <>{emptyComponent}</>;
  }

  return (
    <div
      className={`transition-opacity duration-300 ${isFetching ? "opacity-50 pointer-events-none" : "opacity-100"}`}
    >
      {typeof children === "function" ? children(data as T) : children}
    </div>
  );
}
