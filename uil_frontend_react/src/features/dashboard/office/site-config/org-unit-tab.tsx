import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import TreeItem from "@/components/reusable/tree-item";
import TreeView, { UseChildrenHook } from "@/components/reusable/tree-view";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Command, CommandInput } from "@/components/ui/command";
import { TabsContent } from "@/components/ui/tabs";
import { useGetOrgUnitDirectChildrenList } from "@/data/org_unit/org_units-direct-children-list-query";
import { useOrgUnitTree } from "@/data/org_unit/use-org-unit-tree";
import { OrgUnitResponse } from "@/types/interfaces.org_units";
import { Network } from "lucide-react";

const OrgUnitTab = () => {
  const { isSearching, isLoading, results, searchQuery, setSearchQuery } =
    useOrgUnitTree();

  const useOrgUnitChildren: UseChildrenHook<OrgUnitResponse> = (
    node,
    enabled,
  ) => {
    return useGetOrgUnitDirectChildrenList({ parent_id: node.id }, enabled);
  };

  return (
    <TabsContent value="org_unit" className="space-y-6 mt-4">
      <DashboardContentHeader
        title="Organizational Structure"
        desc="Manage Academic Units"
        hasBackBtn={false}
      />

      <Command shouldFilter={false} className="space-y-3">
        <CommandInput
          placeholder="Search units..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />

        <Card className="gap-2 col-span-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-bold text-lg">
              <Network className="w-4 h-4 text-primary" />
              Unit Hierarchy
            </CardTitle>
            <CardDescription>
              Browse and explore the nested relationship of academic units.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <TreeView
              getHasChildren={(node) => node.total_subnodes > 0}
              getKey={(node) => node.id}
              isLoading={isLoading}
              results={results || []}
              isSearching={isSearching}
              renderItem={(node) => (
                <TreeItem node={node}>
                  {() => (
                    <>
                      <span className="font-medium text-sm truncate">
                        {node.name}
                      </span>
                      <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] text-muted-foreground uppercase tracking-wider">
                        {node.unit_type}
                      </span>
                    </>
                  )}
                </TreeItem>
              )}
              useChildren={useOrgUnitChildren}
            />
          </CardContent>
        </Card>
      </Command>
    </TabsContent>
  );
};

export default OrgUnitTab;
