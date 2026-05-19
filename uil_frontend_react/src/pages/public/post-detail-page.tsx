// @/pages/posts/post-detail-page.tsx
import { useParams } from "react-router-dom";
import { QueryState } from "@/components/reusable/query-state-ui";
import { useGetPostDetail } from "@/data/posts/post-detail-query";
import BackButton from "@/components/reusable/back-button";
import UserPostHeader from "@/features/public/posts/user-posts-header";
import UserPostContent from "@/features/public/posts/user-post-content";
import UserPostSidebar from "@/features/public/posts/user-post-sidebar";
import FeaturedContent from "@/features/public/homepage/featured-content";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const postId = id ? Number(id) : NaN;
  const query = useGetPostDetail(postId);

  return (
    <div className="w-full">
      <div className="mb-4">
        <BackButton />
      </div>

      <QueryState query={query} checkEmpty={(data) => !data} variant="page">
        {(post) => (
          <div className="flex flex-col gap-6">
            <UserPostHeader {...post} />

            <div className="items-start gap-6 grid grid-cols-1 lg:grid-cols-[1fr_22rem]">
              <UserPostContent {...post} />
              <UserPostSidebar {...post} />
            </div>
          </div>
        )}
      </QueryState>

      <FeaturedContent maxVisible={3} variant="related" />
    </div>
  );
}
