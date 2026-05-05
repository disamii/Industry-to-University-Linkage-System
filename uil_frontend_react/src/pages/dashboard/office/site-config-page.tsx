import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrganUnitTab from "@/features/dashboard/office/site-config/org-unit-tab";
import { Network } from "lucide-react";

const SiteConfigPage = () => {
  return (
    <Tabs defaultValue="org_unit">
      <TabsList className="w-full h-11!">
        <TabsTrigger value="org_unit">
          <Network />
          Organizational Strcuture
        </TabsTrigger>

        <TabsTrigger value="this">
          <Network />
          Manage Industries
        </TabsTrigger>
      </TabsList>

      <OrganUnitTab />
    </Tabs>
  );
};

export default SiteConfigPage;
