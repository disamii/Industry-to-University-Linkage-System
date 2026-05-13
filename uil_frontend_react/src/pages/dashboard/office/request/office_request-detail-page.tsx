import BackButton from "@/components/reusable/back-button";
import { QueryState } from "@/components/reusable/query-state-ui";
import { useGetOfficeRequestDetail } from "@/data/requests/office/office_request-detail-query";
import ActionTimeline from "@/features/dashboard/request/request-detail/action-timeline";
import RequestHeader from "@/features/dashboard/request/request-detail/request-header";
import RequestDetailCard from "@/features/dashboard/request/request-detail/request-detail-card";
import OrgUnitCard from "@/features/dashboard/request/request-detail/org_unit-card";
import { useParams } from "react-router-dom";
import IndustryInfoCard from "@/features/dashboard/office/industry-management/industry-info-card";

const OfficeRequestDetailPage = () => {
  const { id } = useParams();
  const query = useGetOfficeRequestDetail(Number(id));

  return (
    <QueryState query={query} checkEmpty={(data) => !data} variant="page">
      {(data) => {
        return (
          <div className="space-y-3">
            <BackButton />

            <div className="items-start gap-6 grid grid-cols-[1fr_30rem]">
              <RequestHeader {...data} />

              <div className="space-y-6">
                <RequestDetailCard {...data} />
                <IndustryInfoCard industry={data.industry} />
                <OrgUnitCard academic_unit={data.academic_unit} />
              </div>

              <ActionTimeline
                actions={data.actions}
                request={{
                  id: data.id,
                  title: data.title,
                  description: data.description,
                }}
              />
            </div>
          </div>
        );
      }}
    </QueryState>
  );
};

export default OfficeRequestDetailPage;
