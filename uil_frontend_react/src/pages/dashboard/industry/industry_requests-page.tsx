import IncomingIndustryRequestsTab from "@/features/dashboard/industry/industry_requests.tsx/incoming-industry_requests-tab";
import OutgoingIndustryRequestsTab from "@/features/dashboard/industry/industry_requests.tsx/outgoing-industry_requests-tab";
import AdmninTabs from "@/features/dashboard/layout/admin-tabs";
import { MoveDownLeft, MoveUpRight } from "lucide-react";

const tabs = [
  {
    value: "outgoing",
    label: "Outgoing",
    Icon: MoveUpRight,
  },
  {
    value: "incoming",
    label: "Incoming",
    Icon: MoveDownLeft,
  },
];

const IndustryRequestsPage = () => {
  return (
    <div className="space-y-6">
      <AdmninTabs defaultValue="outgoing" tabs={tabs}>
        <OutgoingIndustryRequestsTab />
        <IncomingIndustryRequestsTab />
      </AdmninTabs>
    </div>
  );
};

export default IndustryRequestsPage;
