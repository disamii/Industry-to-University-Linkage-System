import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatType } from "@/lib/utils";
import { PostDetailResponse } from "@/types/interfaces.posts";
import { Eye, FileText, Globe, ImageOff, Lock } from "lucide-react";

const PostInfoCard = ({
  title,
  image,
  post_type,
  is_published,
  is_internal_only,
  content,
}: PostDetailResponse) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-bold text-lg">
          <FileText className="w-5 h-5 text-primary" />
          Post Information
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Image */}
          <div className="border rounded-xl overflow-hidden">
            {image ? (
              <img
                src={image}
                alt={title}
                className="w-full h-56 object-cover"
              />
            ) : (
              <div className="flex flex-col justify-center items-center bg-muted/40 w-full h-56 text-muted-foreground">
                <ImageOff className="mb-2 w-8 h-8" />

                <p className="font-medium text-sm">No cover image</p>

                <span className="text-xs">
                  This post does not have an image.
                </span>
              </div>
            )}
          </div>

          {/* Title + Badges */}
          <div className="space-y-3">
            <p className="font-semibold text-xl leading-tight">{title}</p>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="capitalize">
                <Globe className="mr-1 w-3 h-3" />
                {formatType(post_type)}
              </Badge>

              <Badge variant={is_published ? "default" : "secondary"}>
                <Eye className="mr-1 w-3 h-3" />
                {is_published ? "Published" : "Draft"}
              </Badge>

              <Badge variant="secondary">
                <Lock className="mr-1 w-3 h-3" />
                {is_internal_only ? "Internal Only" : "Public"}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Content */}
          <div className="space-y-2">
            <p className="font-semibold text-base">Content</p>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-muted-foreground text-sm leading-7 whitespace-pre-wrap">
                {content || "No content available."}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostInfoCard;
