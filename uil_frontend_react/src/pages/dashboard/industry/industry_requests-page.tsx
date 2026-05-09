import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import { QueryState } from "@/components/reusable/query-state-ui";
import { useGetMyRequestsList } from "@/data/industry_requests/industry/my-requests-list-query";
import RequestsStat from "@/features/dashboard/request/request-table/requests-stat";
import RequestsTable from "@/features/dashboard/request/request-table/requests-table";
import RequestsTableOperations from "@/features/dashboard/request/request-table/requests-table-operations";
import { Entity } from "@/lib/enums";

const IndustryRequestsPage = () => {
  const query = useGetMyRequestsList({
    entity: Entity.INDUSTRY,
    direction: "outgoing",
  });

  return (
    <div className="space-y-6">
      <DashboardContentHeader
        title="Requests Management"
        desc="Manage your requests"
        hasBackBtn={false}
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
    </div>
  );
};

export default IndustryRequestsPage;
