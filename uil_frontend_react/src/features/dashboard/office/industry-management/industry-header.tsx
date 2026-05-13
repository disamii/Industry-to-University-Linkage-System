import { Badge } from "@/components/ui/badge";
import { formatDate, formatType } from "@/lib/utils";
import { IndustryDetailResponse } from "@/types/interfaces.industry";
import { Calendar, MapPin } from "lucide-react";
import IndustryActions from "./industry-actions";

type Props = IndustryDetailResponse & {};

const IndustryHeader = ({
  id,
  name,
  industry_type,
  location,
  address,
  created_at,
}: Props) => {
  return (
    <header className="flex justify-between items-start col-span-full">
      <div className="flex-1 space-y-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-primary text-3xl">{name}</h1>
            <Badge className="capitalize" variant="secondary">
              {formatType(industry_type)}
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-muted-foreground text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(created_at)}
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" />
            {location}
            {address ? `—${address}` : ""}{" "}
          </div>
        </div>
      </div>

      {/* Action Dropdown */}
      <IndustryActions id={id} variant="detail" />
    </header>
  );
};

export default IndustryHeader;
