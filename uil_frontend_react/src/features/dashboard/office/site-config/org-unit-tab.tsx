import DashboardContentHeader from "@/components/reusable/dashboard-content-header";
import { QueryState } from "@/components/reusable/query-state-ui";
import TreeItem from "@/components/reusable/tree-item";
import TreeView, { UseChildrenHook } from "@/components/reusable/tree-view";
import { Card } from "@/components/ui/card";
import { Command, CommandInput } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { useGetOrgUnitDirectChildrenList } from "@/data/org_unit/org_units-direct-children-list-query";
import { useGetOrgUnitsList } from "@/data/org_unit/org_units-list-query";
import { useOrgUnitTree } from "@/data/org_unit/use-org-unit-tree";
import { OrgUnitResponse } from "@/types/interfaces.org_units";

const OrgUnitTab = () => {
  const query = useGetOrgUnitsList();

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

      <QueryState query={query} checkEmpty={(data) => !data}>
        {(data) => {
          return (
            <div className="space-y-6">
              {/* <IndustryRequestsStat stats={data.stats} /> */}
              {/* <IndustryRequestsTableOperations /> */}
            </div>
          );
        }}
      </QueryState>

      <div>
        <Input
          placeholder="Search units..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="ml-auto border-primary w-full max-w-80"
        />

        <Card>
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
        </Card>
      </div>
    </TabsContent>
  );
};

export default OrgUnitTab;
