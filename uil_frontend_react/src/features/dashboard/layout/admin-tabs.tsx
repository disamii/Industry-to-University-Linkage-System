import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

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

const AdmninTabs = ({ tabs, defaultValue, children }: Props) => {
  return (
    <Tabs defaultValue={defaultValue}>
      <TabsList className="w-full h-11!">
        {tabs.map(({ value, label, Icon }, idx) => (
          <TabsTrigger key={`${value}—${idx}`} value={value}>
            {Icon && <Icon />}
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      {children}
    </Tabs>
  );
};

export default AdmninTabs;
