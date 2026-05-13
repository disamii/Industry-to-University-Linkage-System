import { getActionTypeConfig } from "@/features/dashboard/request/utils.request-actions";
import { ActionType } from "@/lib/enums";
import { Badge } from "../ui/badge";
import { Wrench } from "lucide-react";
import { cn, formatType } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// Define the size variants
const badgeVariants = cva("flex items-center gap-1.5 w-fit capitalize", {
  variants: {
    size: {
      default: "px-2.5 py-0.5 text-xs",
      sm: "px-2 py-0 text-[10px] gap-1",
      md: "px-3 py-1 text-sm gap-1.5",
      lg: "px-4 py-1.5 text-base gap-2",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

// Define icon size mapping
const iconSizes: Record<string, string> = {
  sm: "size-2.5",
  default: "size-3",
  md: "size-4",
  lg: "size-5",
};

interface Props extends VariantProps<typeof badgeVariants> {
  type?: ActionType | null;
  className?: string;
}

const RequestActionBadge = ({ type, size = "default", className }: Props) => {
  const config = getActionTypeConfig(type);
  const iconClass = iconSizes[size as string] || iconSizes.default;

  // Fallback for Unknown Actions
  if (!config) {
    return (
      <Badge
        variant="secondary"
        className={cn(badgeVariants({ size }), className)}
      >
        <Wrench className={iconClass} />
        {type ? formatType(type) : "Unknown Action"}
      </Badge>
    );
  }

  return (
    <Badge className={cn(badgeVariants({ size }), config.color, className)}>
      <config.Icon className={iconClass} />
      {config.label}
    </Badge>
  );
};

export default RequestActionBadge;
