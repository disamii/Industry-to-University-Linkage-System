import { getActionTypeConfig } from "@/features/dashboard/request/utils.request-actions";
import { ActionType } from "@/lib/enums";
import { Badge } from "../ui/badge";
import { Wrench } from "lucide-react";
import { cn, formatType } from "@/lib/utils";

type Props = {
  type?: ActionType | null;
  className?: string;
};

const RequestActionBadge = ({ type, className }: Props) => {
  const config = getActionTypeConfig(type);

  if (!config)
    return (
      <Badge variant="secondary" className={className}>
        <Wrench className="w-3 h-3" />
        {type ? formatType(type) : "Unknown Action"}
      </Badge>
    );

  return (
    <Badge className={cn(config.color, "capitalize gap-1.5", className)}>
      <config.Icon className="w-3 h-3" />
      {config?.label}
    </Badge>
  );
};

export default RequestActionBadge;
