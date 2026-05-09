import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import { QueryState } from "@/components/reusable/query-state-ui";
import { useGetIndustryList } from "@/data/industry/industry-list-query";
import IndustryStat from "@/features/dashboard/industry/industry-stat";
import IndustriesTable from "@/features/dashboard/office/industry-management/industries-table";
import IndustriesTableOperations from "@/features/dashboard/office/industry-management/industries-table-operations";

const IndustryManagementPage = () => {
  const query = useGetIndustryList();

  return (
    <div className="space-y-6">
      <DashboardContentHeader
        title="Industries Management"
        desc="Manage industries"
        hasBackBtn={false}
        scope={query.data?.scope}
      />

      <QueryState query={query} checkEmpty={(data) => !data} variant="page">
        {(data) => {
          return (
            <div className="space-y-6">
              <IndustryStat stats={data.stats} />
              <IndustriesTableOperations />
              <IndustriesTable data={data} />
            </div>
          );
        }}
      </QueryState>
    </div>
  );
};

export default IndustryManagementPage;
