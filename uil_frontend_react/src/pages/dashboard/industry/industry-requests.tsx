import { QueryState } from "@/components/reusable/query-state-ui";
import { useGetIndustryRequestMineList } from "@/data/industry_requests/industry_requests-mine-list-query";
import IndustryRequestsTable from "@/features/dashboard/industry/industry_requests-table";

const IndustryRequests = () => {
  const query = useGetIndustryRequestMineList();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-5">
        <h1 className="font-bold text-3xl">Requests Management</h1>
        {/* <Scope scope={data?.scope} /> */}
      </div>

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

export default IndustryRequests;
