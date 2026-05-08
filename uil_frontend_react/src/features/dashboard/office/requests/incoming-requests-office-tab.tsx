import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import { QueryState } from "@/components/reusable/query-state-ui";
import { TabsContent } from "@/components/ui/tabs";
import { useGetIndustryRequestOfficeList } from "@/data/industry_requests/office/industry_requests-office-list-query";
import IndustryRequestsStat from "@/features/dashboard/industry_request/request-table/industry_requests-stat";
import IndustryRequestsTable from "@/features/dashboard/industry_request/request-table/industry_requests-table";
import IndustryRequestsTableOperations from "@/features/dashboard/industry_request/request-table/industry_requests-table-operations";

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
              <IndustryRequestsStat stats={data.stats} />
              <IndustryRequestsTableOperations />
              <IndustryRequestsTable data={data} />
            </div>
          );
        }}
      </QueryState>
    </TabsContent>
  );
};

export default IncomingRequestsOfficeTab;
