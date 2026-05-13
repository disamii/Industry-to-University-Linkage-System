import { Badge } from "@/components/ui/badge";
import { formatDate, formatType } from "@/lib/utils";
import { PostDetailResponse } from "@/types/interfaces.posts";
import { Calendar } from "lucide-react";
import PostActions from "./post-actions";

type Props = PostDetailResponse & {};

const PostHeader = ({
  id,
  title,
  post_type,
  published_at,
  created_at,
}: Props) => {
  return (
    <header className="flex justify-between items-start col-span-full">
      <div className="flex-1 space-y-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-primary text-3xl">{title}</h1>
            <Badge className="capitalize" variant="secondary">
              {formatType(post_type)}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground text-xs">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(published_at || created_at)}
        </div>
      </div>

      <PostActions id={id} title={title} variant="detail" />
    </header>
  );
};

export default PostHeader;
