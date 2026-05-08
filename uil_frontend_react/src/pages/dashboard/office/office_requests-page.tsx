import AdmninTabs from "@/features/dashboard/layout/admin-tabs";
import IncomingRequestsOfficeTab from "@/features/dashboard/office/requests/incoming-requests-office-tab";
import OutgoingRequestsOfficeTab from "@/features/dashboard/office/requests/outgoing-requests-office-tab";
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
        <IncomingRequestsOfficeTab />
        <OutgoingRequestsOfficeTab />
      </AdmninTabs>
    </div>
  );
};

export default OfficeRequestsPage;
