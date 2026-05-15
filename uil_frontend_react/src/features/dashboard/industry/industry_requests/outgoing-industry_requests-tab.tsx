import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import { QueryState } from "@/components/reusable/query-state-ui";
import SubmitNewRequestBtn from "@/components/reusable/submit-new-request-btn";
import { TabsContent } from "@/components/ui/tabs";
import { useGetMyRequestsList } from "@/data/requests/my-requests-list-query";
import RequestsStat from "@/features/dashboard/request/request-table/requests-stat";
import RequestsTable from "@/features/dashboard/request/request-table/requests-table";
import RequestsTableOperations from "@/features/dashboard/request/request-table/requests-table-operations";
import useTabParams from "@/hooks/use-tab-params";
import { Entity } from "@/lib/enums";
import { useNavigate } from "react-router-dom";

const OutgoingIndustryRequestsTab = () => {
  const { params } = useTabParams();
  const entity = Entity.INDUSTRY;

  const query = useGetMyRequestsList({
    entity,
    direction: "outgoing",
    enabled: params.tab === "outgoing",
  });

  const navigate = useNavigate();

  return (
    <TabsContent value="outgoing" className="space-y-6 mt-4">
      <div className="flex justify-between">
        <DashboardContentHeader
          title="Outgoing Requests Management"
          desc="Manage your requests"
          hasBackBtn={false}
        />

        <SubmitNewRequestBtn to="/dashboard/industry/requests/create" />
      </div>

      <QueryState query={query} checkEmpty={(data) => !data} variant="page">
        {(data) => {
          return (
            <div className="space-y-6">
              <RequestsStat stats={data.stats} />
              <RequestsTableOperations requesting_entity={entity} />
              <RequestsTable
                data={data}
                onEdit={(id) =>
                  navigate(`/dashboard/industry/requests/${id}/edit`)
                }
                onDelete={() =>
                  navigate("/dashboard/industry/requests?tab=outgoing")
                }
              />
            </div>
          );
        }}
      </QueryState>
    </TabsContent>
  );
};

export default OutgoingIndustryRequestsTab;
