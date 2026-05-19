import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, User, Paperclip, Clock, Info } from "lucide-react";
import { formatType, getFullName } from "@/lib/utils";
import { PostDetailResponse } from "@/types/interfaces.posts";

type Props = PostDetailResponse;

export default function UserPostSidebar({
  related_object,
  post_type,
  content_type,
}: Props) {
  return (
    <aside className="space-y-6 w-full lg:w-80 shrink-0">
      {/* Related Request Information Card */}
      {related_object && (
        <Card className="bg-card/40 backdrop-blur-sm border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-muted-foreground text-xs uppercase tracking-widest">
              Related Request
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-bold text-foreground text-base leading-snug">
                {related_object.title}
              </h4>
              <p className="mt-1 text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                {related_object.description}
              </p>
            </div>

            <div className="space-y-2.5 pt-3 border-border border-t text-sm">
              {related_object.requesting_entity && (
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary shrink-0" />
                  <span className="font-medium text-foreground">
                    {typeof related_object.requesting_entity === "object"
                      ? related_object.requesting_entity
                      : related_object.requesting_entity || "—"}
                  </span>
                </div>
              )}

              {related_object.requested_by && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-muted-foreground">
                    {getFullName(related_object.requested_by, 2)}
                  </span>
                </div>
              )}

              {related_object.attachment && (
                <a
                  href={related_object.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline transition-colors"
                >
                  <Paperclip className="w-4 h-4 shrink-0" />
                  View attachment
                </a>
              )}

              {related_object.latest_action && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>{formatType(related_object.latest_action)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Short Post Context Info Card */}
      <Card className="bg-card/40 backdrop-blur-sm border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-widest">
            <Info className="w-3.5 h-3.5" /> Quick Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Post Type</span>
            <span className="font-medium text-foreground">
              {formatType(post_type)}
            </span>
          </div>
          {content_type && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Content Context</span>
              <span className="font-medium text-foreground">
                {formatType(content_type)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </aside>
  );
}
