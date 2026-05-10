import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import { QueryState } from "@/components/reusable/query-state-ui";
import SubmitNewRequestBtn from "@/components/reusable/submit-new-request-btn";
import { useGetPostsList } from "@/data/posts/posts-list-query";
import PostsStat from "@/features/dashboard/office/posts/posts-stat";
import PostsTable from "@/features/dashboard/office/posts/posts-table";
import PostsTableOperations from "@/features/dashboard/office/posts/posts-table-operations";

const PostsPage = () => {
  const query = useGetPostsList();

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <DashboardContentHeader
          title="Posts Management"
          desc="Manage posts"
          hasBackBtn={false}
          scope={query.data?.scope}
        />

        <SubmitNewRequestBtn
          to="/dashboard/office/posts/create"
          label="Add New Post"
        />
      </div>

      <QueryState query={query} checkEmpty={(data) => !data} variant="page">
        {(data) => {
          return (
            <div className="space-y-6">
              <PostsStat stats={data.stats} />
              <PostsTableOperations />
              <PostsTable data={data} />
            </div>
          );
        }}
      </QueryState>
    </div>
  );
};

export default PostsPage;
