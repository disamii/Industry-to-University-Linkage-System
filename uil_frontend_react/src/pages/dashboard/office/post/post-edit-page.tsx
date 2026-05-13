import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import { QueryState } from "@/components/reusable/query-state-ui";
import { useGetPostDetail } from "@/data/posts/post-detail-query";
import CreateEditPostForm from "@/features/dashboard/office/posts/create-edit-post-form";
import { useParams } from "react-router-dom";

const PostEditPage = () => {
  const { id } = useParams();
  const query = useGetPostDetail(Number(id));

  return (
    <div className="space-y-3">
      <DashboardContentHeader
        title="Edit Post"
        desc="Modify the details below to update your post."
      />

      <QueryState query={query} checkEmpty={(data) => !data} variant="page">
        {(data) => <CreateEditPostForm postToEdit={data} />}
      </QueryState>
    </div>
  );
};

export default PostEditPage;
