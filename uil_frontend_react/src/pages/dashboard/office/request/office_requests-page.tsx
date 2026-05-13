import AdmninTabs from "@/features/dashboard/layout/admin-tabs";
import IncomingOfficeRequestsTab from "@/features/dashboard/office/office_requests/incoming-office_requests-tab";
import OutgoingOfficeRequestsTab from "@/features/dashboard/office/office_requests/outgoing-office_requests-tab";
import { MoveDownLeft, MoveUpRight } from "lucide-react";

const tabs = [
  {
    value: "incoming",
    label: "Incoming",
    Icon: MoveDownLeft,
  },
  {
    value: "outgoing",
    label: "Outgoing",
    Icon: MoveUpRight,
  },
];

const OfficeRequestsPage = () => {
  return (
    <div className="space-y-6">
      <AdmninTabs defaultValue="incoming" tabs={tabs}>
        <IncomingOfficeRequestsTab />
        <OutgoingOfficeRequestsTab />
      </AdmninTabs>
    </div>
  );
};

export default OfficeRequestsPage;
