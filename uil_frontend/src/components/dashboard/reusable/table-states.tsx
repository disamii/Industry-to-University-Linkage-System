import { Loader2 } from "lucide-react";

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
        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
        Loading...
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
