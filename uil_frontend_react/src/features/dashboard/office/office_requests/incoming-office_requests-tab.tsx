import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import { QueryState } from "@/components/reusable/query-state-ui";
import { TabsContent } from "@/components/ui/tabs";
import { useGetIndustryRequestOfficeList } from "@/data/requests/office/office_requests-list-query";
import RequestsStat from "@/features/dashboard/request/request-table/requests-stat";
import RequestsTable from "@/features/dashboard/request/request-table/requests-table";
import RequestsTableOperations from "@/features/dashboard/request/request-table/requests-table-operations";
import useTabParams from "@/hooks/use-tab-params";

const IncomingOfficeRequestsTab = () => {
  const { params } = useTabParams();
  const query = useGetIndustryRequestOfficeList(params.tab === "incoming");

  return (
    <TabsContent value="incoming" className="space-y-6 mt-4">
      <DashboardContentHeader
        title="Incoming Requests Management"
        desc="Manage industry requests"
        hasBackBtn={false}
        scope={query.data?.scope}
      />

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

export default IncomingOfficeRequestsTab;
