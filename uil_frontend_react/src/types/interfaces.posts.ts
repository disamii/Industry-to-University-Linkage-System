import { PostContentType, PostType } from "@/lib/enums";
import { RequestDetailResponse } from "./interfaces.requests";
import { Metadata } from "./interfaces";

export type PostStats = {
  total_posts: number;
  success_story: number;
  thematic_call: number;
  open_request: number;
  announcement: number;
  guideline: number;
};

export type PostResponse = Metadata & {
  id: number;
  title: string;
  post_type: PostType;
  is_published: boolean;
  is_internal_only: boolean;
  published_at?: string | null;
  expires_at?: string | null;
  content: string;
  image?: string | null;
};

export type PostDetailResponse = PostResponse & {
  related_object: RequestDetailResponse;
  content_type?: PostContentType | null;
};
