import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import { QueryState } from "@/components/reusable/query-state-ui";
import { TabsContent } from "@/components/ui/tabs";
import { useGetMyRequestsList } from "@/data/requests/my-requests-list-query";
import RequestsStat from "@/features/dashboard/request/request-table/requests-stat";
import RequestsTable from "@/features/dashboard/request/request-table/requests-table";
import RequestsTableOperations from "@/features/dashboard/request/request-table/requests-table-operations";
import useTabParams from "@/hooks/use-tab-params";
import { Entity } from "@/lib/enums";

const IncomingIndustryRequestsTab = () => {
  const { params } = useTabParams();
  const entity = Entity.INDUSTRY;

  const query = useGetMyRequestsList({
    entity,
    direction: "incoming",
    enabled: params.tab === "incoming",
  });

  return (
    <TabsContent value="incoming" className="space-y-6 mt-4">
      <DashboardContentHeader
        title="Incoming Requests Management"
        desc="Manage your requests"
        hasBackBtn={false}
      />

      <QueryState query={query} checkEmpty={(data) => !data} variant="page">
        {(data) => {
          return (
            <div className="space-y-6">
              <RequestsStat stats={data.stats} />
              <RequestsTableOperations requesting_entity={entity} />
              <RequestsTable data={data} />
            </div>
          );
        }}
      </QueryState>
    </TabsContent>
  );
};

export default IncomingIndustryRequestsTab;
