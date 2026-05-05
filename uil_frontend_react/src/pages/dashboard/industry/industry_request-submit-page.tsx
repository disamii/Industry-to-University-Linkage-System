import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import CreateEditIndustryRequestsForm from "@/features/dashboard/industry/create-edit-industry_request-form";

const IndustryRequestSubmitPage = () => {
  return (
    <div className="space-y-3">
      <DashboardContentHeader
        title="Submit New Request"
        desc="Complete the details below to initiate a new request"
      />

      <CreateEditIndustryRequestsForm />
    </div>
  );
};

export default IndustryRequestSubmitPage;
