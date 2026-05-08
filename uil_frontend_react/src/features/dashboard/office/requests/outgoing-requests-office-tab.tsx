import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import { TabsContent } from "@/components/ui/tabs";

const OutgoingRequestsOfficeTab = () => {
  return (
    <TabsContent value="outgoing" className="space-y-6 mt-4">
      <DashboardContentHeader
        title="Outgoing Requests Management"
        desc="Manage your requests"
        hasBackBtn={false}
        // scope={query.data?.scope}
      />

      {/* <QueryState query={query} checkEmpty={(data) => !data} variant="page">
        {(data) => {
          return (
            <div className="space-y-6">
              <IndustryRequestsStat stats={data.stats} />
              <IndustryRequestsTableOperations />
              <IndustryRequestsTable data={data} />
            </div>
          );
        }}
      </QueryState> */}
    </TabsContent>
  );
};

export default OutgoingRequestsOfficeTab;
