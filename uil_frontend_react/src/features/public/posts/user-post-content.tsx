import { ImageOff } from "lucide-react";
import { PostDetailResponse } from "@/types/interfaces.posts";

type Props = PostDetailResponse;

export default function UserPostContent({ title, image, content }: Props) {
  return (
    <article className="space-y-8 min-w-0">
      {/* Editorial Cover Media */}
      <div className="bg-muted/30 border border-border rounded-3xl w-full overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full max-h-112.5 object-cover"
          />
        ) : (
          <div className="flex flex-col justify-center items-center gap-2 py-20 text-muted-foreground">
            <ImageOff className="opacity-40 w-10 h-10" />
            <span className="opacity-60 text-xs">No cover image provided</span>
          </div>
        )}
      </div>

      {/* Structured Content Area */}
      <div className="dark:prose-invert max-w-none text-foreground/90 leading-relaxed prose prose-neutral">
        <p className="text-base md:text-lg leading-relaxed whitespace-pre-wrap">
          {content || "This post has no content description."}
        </p>
      </div>
    </article>
  );
}
