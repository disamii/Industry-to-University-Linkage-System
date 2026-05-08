import BackButton from "@/components/reusable/back-button";
import { QueryState } from "@/components/reusable/query-state-ui";
import { useGetAssignmentDetail } from "@/data/assignments/assignment-detail-query";
import AssignmentDetailHeader from "@/features/dashboard/office/assignments/assignment-detail-header";
import { useParams } from "react-router-dom";

const AssignmentDetailPage = () => {
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

              {/*
              <div className="space-y-6">
                <RequestDetailCard {...data} />
                <IndustryInfoCard industry={data.industry} />
                <OrgUnitCard academic_unit={data.academic_unit} />
              </div>

              <ActionTimeline actions={data.actions} /> */}
            </div>
          </div>
        );
      }}
    </QueryState>
  );

  return <div></div>;
};

export default AssignmentDetailPage;
