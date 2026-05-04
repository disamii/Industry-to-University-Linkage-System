import BackButton from "@/components/reusable/back-button";
import { QueryState } from "@/components/reusable/query-state-ui";
import { useGetIndustryRequestDetail } from "@/data/industry_requests/industry_request-detail-query";
import ActionTimeline from "@/features/dashboard/industry/request-detail/action-timeline";
import IndustryRequestHeader from "@/features/dashboard/industry/request-detail/industry_request-header";
import RequestDetailCard from "@/features/dashboard/industry/request-detail/Industry_request-request-detail-card";
import OrgUnitCard from "@/features/dashboard/industry/request-detail/org_unit-card";
import { useParams } from "react-router-dom";

const IndustryRequestDetailPage = () => {
  const { id } = useParams();
  const query = useGetIndustryRequestDetail(Number(id));

  return (
    <QueryState query={query} checkEmpty={(data) => !data}>
      {(data) => {
        return (
          <div className="space-y-3">
            <BackButton />

            <div className="items-start gap-6 grid grid-cols-[1fr_30rem]">
              <IndustryRequestHeader {...data} />

              <div className="space-y-6">
                <RequestDetailCard {...data} />
                <OrgUnitCard academic_unit={data.academic_unit} />
              </div>

              <ActionTimeline actions={data.actions} />
            </div>
          </div>
        );
      }}
    </QueryState>
  );
};

export default IndustryRequestDetailPage;
