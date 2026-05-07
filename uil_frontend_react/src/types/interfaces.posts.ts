import { PostType } from "@/lib/enums";

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
//   related_object: IndustryRequestDetailResponse;
//   content_type?: PostContentType | null;
// };
