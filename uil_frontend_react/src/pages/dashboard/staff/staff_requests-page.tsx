import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import { QueryState } from "@/components/reusable/query-state-ui";
import SubmitNewRequestBtn from "@/components/reusable/submit-new-request-btn";
import { useGetMyRequestsList } from "@/data/requests/my-requests-list-query";
import RequestsStat from "@/features/dashboard/request/request-table/requests-stat";
import RequestsTable from "@/features/dashboard/request/request-table/requests-table";
import RequestsTableOperations from "@/features/dashboard/request/request-table/requests-table-operations";
import useTabParams from "@/hooks/use-tab-params";
import { Entity } from "@/lib/enums";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const StaffRequestsPage = () => {
  const {
    params: { tab },
    setParams,
  } = useTabParams();
  const entity = Entity.STAFF;

  const query = useGetMyRequestsList({
    entity,
    direction: "outgoing",
    enabled: true,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!tab) setParams({ tab: "outgoing" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <DashboardContentHeader
          title="My Requests"
          desc="Manage your requests"
          hasBackBtn={false}
        />

        <SubmitNewRequestBtn to="/dashboard/staff/requests/create" />
      </div>

      <QueryState query={query} checkEmpty={(data) => !data} variant="page">
        {(data) => {
          return (
            <div className="space-y-6">
              <RequestsStat stats={data.stats} />
              <RequestsTableOperations requesting_entity={entity} />
              <RequestsTable
                data={data}
                onEdit={(id) =>
                  navigate(`/dashboard/staff/requests/${id}/edit`)
                }
                onDelete={() =>
                  navigate("/dashboard/staff/requests?tab=outgoing")
                }
              />
            </div>
          );
        }}
      </QueryState>
    </div>
  );
};

export default StaffRequestsPage;
