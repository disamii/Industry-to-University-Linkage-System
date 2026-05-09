import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import CreateEditRequestsForm from "@/features/dashboard/industry/create-edit-industry_request-form";
import { Entity } from "@/lib/enums";
import { useNavigate } from "react-router-dom";

const IndustryRequestSubmitPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      <DashboardContentHeader
        title="Submit New Request"
        desc="Complete the details below to initiate a new request"
      />

      <CreateEditRequestsForm
        requesting_entity={Entity.INDUSTRY}
        onSuccess={() => navigate("/dashboard/industry/requests")}
      />
    </div>
  );
};

export default IndustryRequestSubmitPage;
