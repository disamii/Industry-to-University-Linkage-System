import BackButton from "@/components/reusable/back-button";
import { QueryState } from "@/components/reusable/query-state-ui";
import { useGetPostDetail } from "@/data/posts/post-detail-query";
import PostHeader from "@/features/dashboard/office/posts/post-header";
import PostInfoCard from "@/features/dashboard/office/posts/post-info-card";
import PostMetaDataCard from "@/features/dashboard/office/posts/post-meta-data-card";
import { useParams } from "react-router-dom";

const PostDetailPage = () => {
  const { id } = useParams();
  const query = useGetPostDetail(Number(id));

  return (
    <QueryState query={query} checkEmpty={(data) => !data} variant="page">
      {(data) => {
        return (
          <div className="space-y-3">
            <BackButton />

            <div className="items-start gap-6 grid grid-cols-[1fr_30rem]">
              <PostHeader {...data} />

              <PostInfoCard {...data} />
              <PostMetaDataCard {...data} />
            </div>
          </div>
        );
      }}
    </QueryState>
  );
};

export default PostDetailPage;
