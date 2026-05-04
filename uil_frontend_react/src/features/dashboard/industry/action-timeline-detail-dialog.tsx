import { Badge } from "@/components/ui/badge";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn, formatDate } from "@/lib/utils";
import { RequestAction } from "@/types/interfaces.industry_requests";
import { Building2, Calendar, LucideIcon, MapPin, User } from "lucide-react";
import { actionIcons, actionStyles } from "./utils.actions";

type DetailBoxProps = {
  Icon: LucideIcon;
  label: string;
  value?: string | null;
};

const DetailBox = ({ Icon, label, value }: DetailBoxProps) => {
  if (!value) return null;

  return (
    <div className="space-y-1 bg-muted/50 p-4 rounded-lg">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <div className="pl-6 font-semibold text-base">{value}</div>
    </div>
  );
};

type Props = { action: RequestAction };

const ActionTimelineDetailDialog = ({ action }: Props) => {
  const Icon = actionIcons[action.type];

  return (
    <DialogContent className="sm:max-w-175">
      <DialogHeader>
        <div
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-lg w-fit",
            actionStyles[action.type],
          )}
        >
          <Icon className="w-4 h-4" />
          <Badge
            variant="secondary"
            className={`capitalize text-[10px] font-bold px-2 text-sm leading-none ${actionStyles[action.type]} bg-transparent`}
          >
            {action.type.replace(/_/g, " ")}
          </Badge>
        </div>
        <DialogTitle className="font-bold text-2xl">
          {action.description}
        </DialogTitle>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Calendar className="w-4 h-4" />
          {formatDate(action.created_at)}
        </div>
      </DialogHeader>

      <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
        <DetailBox
          Icon={User}
          label="Performed By"
          value={action.performed_by}
        />
        <DetailBox
          Icon={Building2}
          label="From Industry"
          value={action.from_industry}
        />
        <DetailBox
          Icon={Building2}
          label="To Industry"
          value={action.to_industry}
        />
        <DetailBox Icon={MapPin} label="From Unit" value={action.from_unit} />
        <DetailBox Icon={MapPin} label="To Unit" value={action.to_unit} />
      </div>
    </DialogContent>
  );
};

export default ActionTimelineDetailDialog;
