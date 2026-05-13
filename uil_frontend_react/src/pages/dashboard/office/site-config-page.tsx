import AdmninTabs from "@/features/dashboard/layout/admin-tabs";
import OrganUnitTab from "@/features/dashboard/office/site-config/org-unit-tab";
import RoleManagementTab from "@/features/dashboard/office/site-config/role-management-tab";
import StaffManagementTab from "@/features/dashboard/office/site-config/staff-management-tab";
import { Network, Shield, Users } from "lucide-react";

const tabs = [
  {
    value: "staff_management",
    label: "Staff Management",
    Icon: Users,
  },
  {
    value: "role_management",
    label: "Role Management",
    Icon: Shield,
  },
  {
    value: "org_unit",
    label: "Organizational Strcuture",
    Icon: Network,
  },
];

const SiteConfigPage = () => {
  return (
    <AdmninTabs defaultValue="staff_management" tabs={tabs}>
      <StaffManagementTab />
      <RoleManagementTab />
      <OrganUnitTab />
    </AdmninTabs>
  );
};

export default SiteConfigPage;
