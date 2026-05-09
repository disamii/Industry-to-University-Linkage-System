import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import { QueryState } from "@/components/reusable/query-state-ui";
import { useGetIndustryRequestDetail } from "@/data/requests/industry/industry_request-detail-query";
import CreateEditRequestsForm from "@/features/dashboard/industry/create-edit-industry_request-form";
import { Entity } from "@/lib/enums";
import { useParams } from "react-router-dom";

const OfficeRequestEditPage = () => {
  const { id } = useParams();
  const query = useGetIndustryRequestDetail(Number(id));

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
          />
        )}
      </QueryState>
    </div>
  );
};

export default OfficeRequestEditPage;
