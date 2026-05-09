import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import { QueryState } from "@/components/reusable/query-state-ui";
import { useGetIndustryRequestMineList } from "@/data/industry_requests/industry/industry_requests-mine-list-query";
import RequestsStat from "@/features/dashboard/request/request-table/requests-stat";
import RequestsTable from "@/features/dashboard/request/request-table/requests-table";
import RequestsTableOperations from "@/features/dashboard/request/request-table/requests-table-operations";

const IndustryRequestsPage = () => {
  const query = useGetIndustryRequestMineList();

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
