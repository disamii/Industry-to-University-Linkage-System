import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import { QueryState } from "@/components/reusable/query-state-ui";
import { useGetPostsList } from "@/data/posts/posts-list-query";
import PostsTable from "@/features/dashboard/office/posts/posts-table";
import PostsTableOperations from "@/features/dashboard/office/posts/posts-table-operations";

const PostsPage = () => {
  const query = useGetPostsList();

  return (
    <div className="space-y-6">
      <DashboardContentHeader
        title="Posts Management"
        desc="Manage posts"
        hasBackBtn={false}
        scope={query.data?.scope}
      />

      <QueryState query={query} checkEmpty={(data) => !data} variant="page">
        {(data) => {
          return (
            <div className="space-y-6">
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
