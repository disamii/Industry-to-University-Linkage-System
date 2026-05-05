import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import { QueryState } from "@/components/reusable/query-state-ui";
import { useGetIndustryRequestOfficeList } from "@/data/industry_requests/office/industry_requests-office-list-query";
import IndustryRequestsStat from "@/features/dashboard/industry_request/request-table/industry_requests-stat";
import IndustryRequestsTable from "@/features/dashboard/industry_request/request-table/industry_requests-table";
import IndustryRequestsTableOperations from "@/features/dashboard/industry_request/request-table/industry_requests-table-operations";

const IndustryRequestsOfficePage = () => {
  const query = useGetIndustryRequestOfficeList();

  return (
    <div className="space-y-6">
      <DashboardContentHeader
        title="Requests Management"
        desc="Manage your requests"
        hasBackBtn={false}
        scope={query.data?.scope}
      />

      <QueryState query={query} checkEmpty={(data) => !data}>
        {(data) => {
          return (
            <div className="space-y-6">
              <IndustryRequestsStat stats={data.stats} />
              <IndustryRequestsTableOperations isOffice={true} />
              <IndustryRequestsTable data={data} isOffice={true} />
            </div>
          );
        }}
      </QueryState>
    </div>
  );
};

export default IndustryRequestsOfficePage;
