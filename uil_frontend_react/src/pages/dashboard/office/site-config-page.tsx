import AdmninTabs from "@/features/dashboard/layout/admin-tabs";
import OrganUnitTab from "@/features/dashboard/office/site-config/org-unit-tab";
import RoleManagementTab from "@/features/dashboard/office/site-config/role-management-tab";
import { Network, Shield } from "lucide-react";

const tabs = [
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
    <AdmninTabs defaultValue="role_management" tabs={tabs}>
      <OrganUnitTab />
      <RoleManagementTab />
    </AdmninTabs>
  );
};

export default SiteConfigPage;
