import { Spinner } from "@/components/reusable/spinner";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export function TableState({
  type,
  message,
  refetch,
}: {
  type: "loading" | "error" | "empty";
  message?: string;
  refetch?: () => void;
}) {
  if (type === "loading") {
    return (
      <div className="flex justify-center items-center gap-2 py-10 text-muted-foreground">
        <Spinner size="sm" /> <span>Loading...</span>
      </div>
    );
  }

  if (type === "error") {
    return (
      <div className="flex flex-col justify-center items-center gap-2 py-6 text-destructive">
        {message ?? "Something went wrong"}
        {refetch && (
          <Button variant="secondary" size="sm" onClick={refetch}>
            <RefreshCcw /> Retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-10 text-muted-foreground">
      {message ?? "No data available"}
    </div>
  );
}
