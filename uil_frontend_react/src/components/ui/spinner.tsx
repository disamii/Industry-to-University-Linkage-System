import { cn } from "@/lib/utils";
import { ComponentVariant } from "@/types/interfaces";
import { Loader2Icon } from "lucide-react";

interface SpinnerProps extends React.ComponentProps<"svg"> {
  variant?: ComponentVariant;
}

const spinnerSizes = {
  small: "size-4",
  inline: "size-5",
  section: "size-8",
  page: "size-12",
};

export function Spinner({
  className,
  variant = "inline",
  ...props
}: SpinnerProps) {
  return (
    <div
      className={cn(
        "flex justify-center items-center",
        variant === "section" && "py-12",
        variant === "page" && "min-h-[50vh]",
      )}
    >
      <Loader2Icon
        role="status"
        className={cn(
          "text-muted-foreground animate-spin",
          spinnerSizes[variant],
          className,
        )}
        {...props}
      />
    </div>
  );
}
