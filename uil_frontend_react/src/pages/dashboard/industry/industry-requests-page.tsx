import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import { QueryState } from "@/components/reusable/query-state-ui";
import { useGetIndustryRequestMineList } from "@/data/industry_requests/industry_requests-mine-list-query";
import IndustryRequestsTable from "@/features/dashboard/industry/industry_requests-table";

const IndustryRequestsPage = () => {
  const query = useGetIndustryRequestMineList();

  return (
    <div className="space-y-6">
      <DashboardContentHeader
        title="Requests Management"
        desc="Manage your requests"
        hasBackBtn={false}
      />

      {/* <UserStatistics counts={data!.counts} /> */}

      {/* <UserTableOperations /> */}

      <QueryState
        query={query}
        checkEmpty={(data) => data.results.length === 0}
      >
        {(data) => <IndustryRequestsTable data={data} />}
      </QueryState>
    </div>
  );
};

export default IndustryRequestsPage;
