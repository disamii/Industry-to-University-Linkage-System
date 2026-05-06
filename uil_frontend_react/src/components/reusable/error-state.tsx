import { AlertTriangle, RotateCcw, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ComponentVariant } from "@/types/interfaces";
import { variantContainers } from "@/lib/mappings";

interface ErrorStateProps {
  error?: Error | null;
  reset?: () => void;
  variant?: ComponentVariant;
  title?: string;
  message?: string;
}

const ErrorState = ({
  error,
  reset,
  variant = "section",
  title = "Something went wrong",
  message = "An unexpected error occurred.",
}: ErrorStateProps) => {
  const isSmall = variant === "small";

  return (
    <div
      className={cn(
        "flex flex-col items-center text-center",
        variantContainers[variant],
      )}
    >
      {/* Icon - Smaller for inline/small, larger for page */}
      <div
        className={cn(
          "flex justify-center items-center bg-destructive/10 rounded-full text-destructive",
          isSmall ? "w-8 h-8 mb-2" : "w-16 h-16 mb-4",
          variant === "page" && "w-20 h-20 mb-6",
        )}
      >
        <AlertTriangle className={isSmall ? "w-4 h-4" : "w-8 h-8"} />
      </div>

      {/* Content */}
      <div className="max-w-md">
        <h3
          className={cn(
            "font-semibold text-destructive",
            isSmall ? "text-xs" : "text-lg",
          )}
        >
          {title}
        </h3>

        {!isSmall && (
          <p className="mt-1 text-muted-foreground text-sm">
            {error?.message || message}
          </p>
        )}
      </div>

      {/* Actions - Hidden or simplified for small variant */}
      {!isSmall && (
        <div className={cn("flex gap-3", variant === "page" ? "mt-8" : "mt-6")}>
          {reset && (
            <Button
              onClick={reset}
              variant="destructive"
              size={variant === "inline" ? "sm" : "default"}
            >
              <RotateCcw className="mr-2 w-4 h-4" />
              Try Again
            </Button>
          )}
          <Button
            variant="outline"
            size={variant === "inline" ? "sm" : "default"}
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="mr-2 w-4 h-4" />
            Refresh
          </Button>
        </div>
      )}
    </div>
  );
};

export default ErrorState;
