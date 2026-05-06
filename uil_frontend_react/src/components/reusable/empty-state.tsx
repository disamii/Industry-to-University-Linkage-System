import { SearchX } from "lucide-react";
import { cn } from "@/lib/utils";
import { ComponentVariant } from "@/types/interfaces";
import { variantContainers } from "@/lib/mappings";

type EmptyProps = {
  resourceName?: string;
  colCount?: number;
  variant?: ComponentVariant;
};

function EmptyState({
  resourceName = "data",
  colCount,
  variant = "section",
}: EmptyProps) {
  // 1. Table Variant Logic
  if (colCount) {
    return (
      <tbody>
        <tr>
          <td colSpan={colCount} className="p-12 text-center">
            <div className="flex flex-col justify-center items-center text-muted-foreground">
              <SearchX className="opacity-20 mb-2 w-8 h-8" />
              <p className="font-medium">No {resourceName} found</p>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  // 2. Standard Layout Logic
  return (
    <div
      className={cn(
        "flex flex-col justify-center items-center text-center",
        variantContainers[variant],
        variant === "small"
          ? "bg-transparent"
          : "bg-muted/30 border border-dashed",
      )}
    >
      <SearchX
        className={cn(
          "text-muted-foreground/40",
          variant === "small" ? "w-5 h-5 mb-1" : "w-12 h-12 mb-4",
          variant === "page" && "w-16 h-16",
        )}
      />

      <p
        className={cn(
          "font-medium text-muted-foreground",
          variant === "small" ? "text-xs" : "text-xl",
        )}
      >
        No {resourceName} could be found 🧐
      </p>

      {variant === "page" && (
        <p className="mt-2 max-w-xs text-muted-foreground/60 text-sm">
          It looks like there isn't anything here yet. Check back later or try
          adjusting your filters.
        </p>
      )}
    </div>
  );
}

export default EmptyState;
