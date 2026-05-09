import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import { QueryState } from "@/components/reusable/query-state-ui";
import { TabsContent } from "@/components/ui/tabs";
import { useGetIndustryRequestOfficeList } from "@/data/industry_requests/office/office_requests-list-query";
import RequestsStat from "@/features/dashboard/request/request-table/requests-stat";
import RequestsTable from "@/features/dashboard/request/request-table/requests-table";
import RequestsTableOperations from "@/features/dashboard/request/request-table/requests-table-operations";

const IncomingRequestsOfficeTab = () => {
  const query = useGetIndustryRequestOfficeList();

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

export default IncomingRequestsOfficeTab;
