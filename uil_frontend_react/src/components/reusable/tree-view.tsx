import { CommandEmpty } from "@/components/ui/command";
import { useGetOrgUnitDirectChildrenList } from "@/data/org_unit/org_units-direct-children-list-query";
import { useGetOrgUnitsList } from "@/data/org_unit/org_units-list-query";
import { cn } from "@/lib/utils";
import { OrgUnitResponse } from "@/types/interfaces.org_units";
import { ChevronRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { Spinner } from "../ui/spinner";

type TreeBaseProps = {
  onSelect?: (node: OrgUnitResponse) => void;
  searchQuery?: string;
};

type TreeItemProps = TreeBaseProps & {
  node: OrgUnitResponse;
};

const TreeItem = ({ onSelect, node }: TreeItemProps) => (
  <div
    onClick={() => onSelect?.(node)}
    className="flex items-center gap-2 py-1 cursor-pointer grow"
  >
    <span className="font-medium text-sm truncate">{node.name}</span>
    <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] text-muted-foreground uppercase tracking-wider">
      {node.unit_type}
    </span>
  </div>
);

type TreeNodeProps = TreeBaseProps & {
  node: OrgUnitResponse;
  level: number;
  expandedNodes: Set<number>;
  onToggleExpand: (nodeId: number) => void;
};

const TreeNode = ({
  node,
  level,
  onSelect,
  expandedNodes,
  onToggleExpand,
  searchQuery,
}: TreeNodeProps) => {
  const isExpanded = expandedNodes.has(node.id);

  const { data: children, isLoading } = useGetOrgUnitDirectChildrenList(
    { parent_id: node.id },
    isExpanded,
  );

  const hasChildren = node.total_subnodes > 0;

  if (!node) return null;

  return (
    <div
      className={cn("flex flex-col", level > 0 && "pl-4 border-muted border-l")}
    >
      <div
        className={cn(
          "flex items-center gap-1 hover:bg-accent px-2 py-1 rounded-sm transition-colors hover:text-accent-foreground",
        )}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(node.id);
            }}
            className="flex justify-center items-center hover:bg-muted rounded w-6 h-6 shrink-0"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <ChevronRight
                className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  isExpanded && "rotate-90",
                )}
              />
            )}
          </button>
        ) : (
          <div className="w-6" />
        )}

        <TreeItem onSelect={onSelect} node={node} />
      </div>
      {isExpanded && children && children.results.length > 0 && (
        <div className="flex flex-col mt-1">
          {children.results.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onSelect={onSelect}
              expandedNodes={expandedNodes} // Critical: pass the state down
              onToggleExpand={onToggleExpand}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
};

type TreeViewProps = TreeBaseProps & {};

const TreeView = ({ onSelect, searchQuery }: TreeViewProps) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  const isSearching = !!searchQuery && searchQuery.length > 0;

  // 1. Fetch root units
  const { data: rootChildren, isLoading: isRootLoading } =
    useGetOrgUnitDirectChildrenList();

  // 2. Fetch search results from backend when searchQuery exists
  const { data: searchResults, isLoading: isSearchLoading } =
    useGetOrgUnitsList({ search: searchQuery }, isSearching);

  const isLoading = isSearching ? isSearchLoading : isRootLoading;
  const results = isSearching ? searchResults?.results : rootChildren?.results;

  const handleToggleExpand = (nodeId: number) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  return (
    <div className="p-2 max-h-80 overflow-y-auto">
      {isLoading ? (
        <Spinner />
      ) : results && results.length > 0 ? (
        <div className="space-y-1">
          {results.map((node) =>
            isSearching ? (
              <TreeItem onSelect={onSelect} node={node} />
            ) : (
              <TreeNode
                key={node.id}
                node={node}
                level={0}
                onSelect={onSelect}
                expandedNodes={expandedNodes}
                onToggleExpand={handleToggleExpand}
              />
            ),
          )}
        </div>
      ) : (
        <CommandEmpty className="py-6 text-sm text-center">
          No units found.
        </CommandEmpty>
      )}
    </div>
  );
};

export default TreeView;
