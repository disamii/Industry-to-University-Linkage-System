import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useTabParams from "@/hooks/use-tab-params";
import { LucideIcon } from "lucide-react";
import { ReactNode, useEffect } from "react";

type Tab = {
  value: string;
  label: string;
  Icon?: LucideIcon;
};

type Props = {
  tabs: Tab[];
  defaultValue: string;
  children: ReactNode;
};

const AdminTabs = ({ tabs, defaultValue, children }: Props) => {
  const { params, setParams } = useTabParams();

  // Derive the active tab synchronously — no waiting for useEffect
  const activeTab = params.tab || defaultValue;

  useEffect(() => {
    if (!params.tab) {
      setParams({ tab: defaultValue });
    }
  }, [params.tab, defaultValue, setParams]);

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setParams({ tab: value })}
    >
      <TabsList className="w-full h-11!">
        {tabs.map(({ value, label, Icon }, idx) => (
          <TabsTrigger key={`${value}-${idx}`} value={value}>
            {Icon && <Icon className="mr-2 w-4 h-4" />}
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      {children}
    </Tabs>
  );
};

export default AdminTabs;
