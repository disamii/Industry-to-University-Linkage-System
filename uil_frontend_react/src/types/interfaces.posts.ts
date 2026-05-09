import { PostType } from "@/lib/enums";

export type PostStats = {
  total_posts: number;
  success_story: number;
  thematic_area: number;
  open_request: number;
  announcement: number;
  guideline: number;
};

export type PostResponse = {
  id: number;
  title: string;
  post_type: PostType;
  is_published: boolean;
  is_internal_only: boolean;
  published_at?: string | null;
  expires_at?: string | null;
};

// export type PostDetailResponse = PostResponse & {
//   content: string;
//   image?: string | null;
//   related_object: RequestDetailResponse;
//   content_type?: PostContentType | null;
// };
