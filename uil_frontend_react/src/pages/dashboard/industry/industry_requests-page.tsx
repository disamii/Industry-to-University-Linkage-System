import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import { QueryState } from "@/components/reusable/query-state-ui";
import { useGetIndustryRequestMineList } from "@/data/industry_requests/industry/industry_requests-mine-list-query";
import IndustryRequestsStat from "@/features/dashboard/industry_request/request-table/industry_requests-stat";
import IndustryRequestsTable from "@/features/dashboard/industry_request/request-table/industry_requests-table";
import IndustryRequestsTableOperations from "@/features/dashboard/industry_request/request-table/industry_requests-table-operations";

const IndustryRequestsPage = () => {
  const query = useGetIndustryRequestMineList();

  return (
    <div className="space-y-6">
      <DashboardContentHeader
        title="Requests Management"
        desc="Manage your requests"
        hasBackBtn={false}
      />

      <QueryState query={query} checkEmpty={(data) => !data}>
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
    </div>
  );
};

export default IndustryRequestsPage;
