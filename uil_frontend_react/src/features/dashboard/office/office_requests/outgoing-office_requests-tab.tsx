import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import { QueryState } from "@/components/reusable/query-state-ui";
import { TabsContent } from "@/components/ui/tabs";
import { Entity } from "@/lib/enums";
import RequestsStat from "../../request/request-table/requests-stat";
import RequestsTableOperations from "../../request/request-table/requests-table-operations";
import RequestsTable from "../../request/request-table/requests-table";
import SubmitNewRequestBtn from "@/components/reusable/submit-new-request-btn";
import { useGetMyRequestsList } from "@/data/requests/my-requests-list-query";
import useTabParams from "@/hooks/use-tab-params";

const OutgoingOfficeRequestsTab = () => {
  const { params } = useTabParams();
  const query = useGetMyRequestsList({
    entity: Entity.ACADEMIC_UNIT,
    direction: "outgoing",
    enabled: params.tab === "outgoing",
  });

  return (
    <TabsContent value="outgoing" className="space-y-6 mt-4">
      <div className="flex justify-between">
        <DashboardContentHeader
          title="Outgoing Requests Management"
          desc="Manage your requests"
          hasBackBtn={false}
          scope={query.data?.scope}
        />

        <SubmitNewRequestBtn to="/dashboard/office/requests/create" />
      </div>

      <QueryState query={query} checkEmpty={(data) => !data} variant="page">
        {(data) => {
          return (
            <div className="space-y-6">
              <RequestsStat stats={data.stats} />
              <RequestsTableOperations />
              <RequestsTable data={data} />
            </div>
          );
        }}
      </QueryState>
    </TabsContent>
  );
};

export default OutgoingOfficeRequestsTab;
