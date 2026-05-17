import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import { TabsContent } from "@/components/ui/tabs";
import AdminTabs from "@/features/dashboard/layout/admin-tabs";
import { getFullName } from "@/lib/utils";
import { useAuthStore } from "@/store/use-auth-store";
import { User, UserRoundCog } from "lucide-react";

const tabs = [
  {
    value: "account",
    label: "Manage Account",
    Icon: UserRoundCog,
  },
  {
    value: "profile",
    label: "Manage Profile",
    Icon: User,
  },
];

const StaffManageAccountPage = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <DashboardContentHeader
        title={`Manage your Account, ${getFullName(user!, 1)}`}
        hasBackBtn={true}
      />

      <AdminTabs defaultValue="account" tabs={tabs}>
        <TabsContent value="account" className="space-y-6 mt-4"></TabsContent>
      </AdminTabs>
    </div>
  );
};

export default StaffManageAccountPage;
