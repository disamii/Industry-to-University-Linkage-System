import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error?: Error | null;
  reset?: () => void;
  title?: string;
  message?: string;
}

export const ErrorState = ({
  error,
  reset,
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
}: ErrorStateProps) => {
  return (
    <div className="flex flex-col justify-center items-center p-8 border rounded-xl text-center">
      {/* Icon */}
      <div className="flex justify-center items-center bg-destructive/10 mb-4 rounded-full w-16 h-16 text-destructive">
        <AlertTriangle className="w-8 h-8" />
      </div>

      {/* Title */}
      <h3 className="mb-1 font-semibold text-destructive text-lg">{title}</h3>

      {/* Message */}
      <p className="mb-6 max-w-xs text-muted-foreground text-sm">
        {error?.message || message}
      </p>

      {/* Actions */}
      <div className="flex gap-3">
        {reset && (
          <Button onClick={reset} variant="destructive">
            <RotateCcw className="mr-2 w-4 h-4" />
            Try Again
          </Button>
        )}

        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
      </div>
    </div>
  );
};
