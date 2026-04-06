import AdminHeaderTitle from "@/components/dashboard/reusable/admin-header-title";
import CreateEditIndustryRequestsForm from "@/features/dashboard/industry_requests/create-edit-industry_requests-form";

export default function SubmitRequest() {
  return (
    <div className="space-y-8 mx-auto">
      <AdminHeaderTitle
        title="Submit New Request"
        desc="Complete the details below to initiate a formal collaboration request
          with university experts."
        backLink={{
          linkLabel: "Back to Dashboard",
          href: "/dashboard/industry",
        }}
      />

      <CreateEditIndustryRequestsForm />
    </div>
  );
}
