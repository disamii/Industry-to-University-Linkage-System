import BackButton from "@/components/reusable/back-button";
import { QueryState } from "@/components/reusable/query-state-ui";
import { useGetIndustryRequestOfficeDetail } from "@/data/industry_requests/office/industry_request-detail-query";
import ActionTimeline from "@/features/dashboard/industry_request/request-detail/action-timeline";
import IndustryRequestHeader from "@/features/dashboard/industry_request/request-detail/industry_request-header";
import IndustryInfoCard from "@/features/dashboard/industry_request/request-detail/Industry_request-industry-info-card";
import RequestDetailCard from "@/features/dashboard/industry_request/request-detail/Industry_request-request-detail-card";
import OrgUnitCard from "@/features/dashboard/industry_request/request-detail/org_unit-card";
import { useParams } from "react-router-dom";

const IndustryRequestDetailOfficePage = () => {
  const { id } = useParams();
  const query = useGetIndustryRequestOfficeDetail(Number(id));

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
                <IndustryInfoCard industry={data.industry} />
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

export default IndustryRequestDetailOfficePage;
