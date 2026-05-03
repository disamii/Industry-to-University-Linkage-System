import { QueryState } from "@/components/reusable/query-state-ui";
import { Button } from "@/components/ui/button";
import { useGetIndustryRequestDetail } from "@/data/industry_requests/industry_request-detail-query";
import CreateEditIndustryRequestsForm from "@/features/dashboard/industry/create-edit-industry_request-form";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const IndustryEditRequest = () => {
  const { id } = useParams();
  const query = useGetIndustryRequestDetail(Number(id));

  return (
    <div className="space-y-3">
      <Button
        asChild
        variant="ghost"
        className="hover:bg-transparent px-0 text-muted-foreground hover:text-foreground"
      >
        <Link to="/dashboard/industry/requests">
          <ArrowLeft />
          Back to Requests
        </Link>
      </Button>

      <div className="space-y-1 mb-8">
        <h1 className="font-bold text-3xl">Edit Request</h1>
        <p className="text-muted-foreground">
          Update the details of this request. Modify only the fields you want to
          change.
        </p>
      </div>
      <QueryState query={query} checkEmpty={(data) => !data}>
        {(data) => <CreateEditIndustryRequestsForm requestToEdit={data} />}
      </QueryState>
    </div>
  );
};

export default IndustryEditRequest;
