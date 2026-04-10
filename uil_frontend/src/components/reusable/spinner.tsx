import { LoaderIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const sizeVariants = {
  sm: "h-4 w-4",
  default: "h-8 w-8",
  lg: "h-12 w-12",
} as const;

type SpinnerProps = {
  size?: keyof typeof sizeVariants;
  center?: boolean; // centers relative to parent
} & React.ComponentProps<"svg">;

export function Spinner({
  size = "default",
  center = false,
  className,
  ...props
}: SpinnerProps) {
  const spinnerIcon = (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("animate-spin", sizeVariants[size], className)}
      {...props}
    />
  );

  if (center) {
    return (
      <div
        className="flex justify-center items-center"
        style={{ minHeight: "20vh" }}
      >
        {spinnerIcon}
      </div>
    );
  }

  return spinnerIcon;
}
