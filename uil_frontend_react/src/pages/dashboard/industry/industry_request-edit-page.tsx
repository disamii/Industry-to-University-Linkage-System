import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import { QueryState } from "@/components/reusable/query-state-ui";
import { useGetRequestDetail } from "@/data/requests/request-detail-query";
import CreateEditRequestsForm from "@/features/dashboard/industry/create-edit-request-form";
import { Entity } from "@/lib/enums";
import { useNavigate, useParams } from "react-router-dom";

const IndustryRequestEditPage = () => {
  const { id } = useParams();
  const query = useGetRequestDetail(Number(id));
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      <DashboardContentHeader
        title="Edit Request"
        desc="
          Update the details of this request. Modify only the fields you want to
          change."
      />

      <QueryState query={query} checkEmpty={(data) => !data} variant="page">
        {(data) => (
          <CreateEditRequestsForm
            requestToEdit={data}
            requesting_entity={Entity.INDUSTRY}
            onSuccess={() => navigate("/dashboard/industry/requests")}
          />
        )}
      </QueryState>
    </div>
  );
};

export default IndustryRequestEditPage;
