import { Badge } from "@/components/ui/badge";
import { Calendar, CalendarX } from "lucide-react";
import { formatDate, formatType } from "@/lib/utils";
import { PostDetailResponse } from "@/types/interfaces.posts";

type Props = PostDetailResponse;

export default function UserPostHeader({
  title,
  post_type,
  is_internal_only,
  published_at,
  expires_at,
}: Props) {
  return (
    <header className="pb-6 border-border border-b w-full">
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          className="font-bold uppercase tracking-wider"
          variant="secondary"
        >
          {formatType(post_type)}
        </Badge>
        {is_internal_only && (
          <Badge className="bg-amber-500/10 hover:bg-amber-500/10 border-transparent font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider">
            Internal Only
          </Badge>
        )}
      </div>

      <h1 className="font-bold text-foreground text-3xl md:text-5xl leading-tight tracking-tight">
        {title}
      </h1>

      <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm">
        {published_at && (
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-primary" />
            <span>Published {formatDate(published_at)}</span>
          </div>
        )}
        {expires_at && (
          <div className="flex items-center gap-1.5">
            <CalendarX className="w-4 h-4 text-destructive" />
            <span>Expires {formatDate(expires_at)}</span>
          </div>
        )}
      </div>
    </header>
  );
}
