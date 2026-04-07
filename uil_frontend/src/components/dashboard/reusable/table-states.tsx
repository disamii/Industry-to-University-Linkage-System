import { Spinner } from "@/components/reusable/spinner";

export function TableState({
  type,
  message,
}: {
  type: "loading" | "error" | "empty";
  message?: string;
}) {
  if (type === "loading") {
    return (
      <div className="flex justify-center items-center py-10 text-muted-foreground">
        <Spinner size="sm" /> <span>Loading...</span>
      </div>
    );
  }

  if (type === "error") {
    return (
      <div className="flex justify-center items-center py-10 text-destructive">
        {message ?? "Something went wrong"}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-10 text-muted-foreground">
      {message ?? "No data available"}
    </div>
  );
}
