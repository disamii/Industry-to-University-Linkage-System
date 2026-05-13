import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import CreateEditPostForm from "@/features/dashboard/office/posts/create-edit-post-form";

const PostCreatePage = () => {
  return (
    <div className="space-y-3">
      <DashboardContentHeader
        title="Create New Post"
        desc="Fill in the information below to publish your post."
      />

      <CreateEditPostForm />
    </div>
  );
};

export default PostCreatePage;
