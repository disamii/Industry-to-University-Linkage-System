import BackButton from "@/components/reusable/back-button";
import { QueryState } from "@/components/reusable/query-state-ui";
import { useGetAssignmentDetail } from "@/data/assignments/assignment-detail-query";
import AssignmentDetailHeader from "@/features/dashboard/assignments/assignment-detail-header";
import IndustryInfoCard from "@/features/dashboard/office/industry-management/industry-info-card";
import ActionTimeline from "@/features/dashboard/request/request-detail/action-timeline";
import OrgUnitCard from "@/features/dashboard/request/request-detail/org_unit-card";
import RequestDetailCard from "@/features/dashboard/request/request-detail/request-detail-card";
import { useParams } from "react-router-dom";

const StaffAssignmentDetail = () => {
  const { id } = useParams();
  const query = useGetAssignmentDetail(Number(id));

  return (
    <QueryState query={query} checkEmpty={(data) => !data} variant="page">
      {(data) => {
        return (
          <div className="space-y-3">
            <BackButton />

            <div className="items-start gap-6 grid grid-cols-[1fr_30rem]">
              <AssignmentDetailHeader {...data} />

              <div className="space-y-6">
                <RequestDetailCard {...data.request} assignment={data} />
                <IndustryInfoCard industry={data.request.industry} />
                <OrgUnitCard
                  academic_unit={
                    data.request.academic_unit ||
                    data.request.academic_unit_name
                  }
                />
              </div>

              <ActionTimeline
                actions={data.request.actions}
                request={{
                  id: data.request.id,
                  title: data.request.title,
                  description: data.request.description,
                }}
              />
            </div>
          </div>
        );
      }}
    </QueryState>
  );
};

export default StaffAssignmentDetail;
