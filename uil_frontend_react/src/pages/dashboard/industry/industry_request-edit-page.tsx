import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import { QueryState } from "@/components/reusable/query-state-ui";
import { useGetIndustryRequestDetail } from "@/data/industry_requests/industry/industry_request-detail-query";
import CreateEditIndustryRequestsForm from "@/features/dashboard/industry/create-edit-industry_request-form";
import { useParams } from "react-router-dom";

const IndustryRequestEditPage = () => {
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

      <QueryState query={query} checkEmpty={(data) => !data}>
        {(data) => <CreateEditIndustryRequestsForm requestToEdit={data} />}
      </QueryState>
    </div>
  );
};

export default IndustryRequestEditPage;
