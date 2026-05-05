import { CommandEmpty } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { ChevronRight, Loader2 } from "lucide-react";
import { ReactNode, useState } from "react";
import { Spinner } from "../ui/spinner";
import { TreeContext, useTreeContext } from "@/contexts/tree-context";

export type UseChildrenHook<T> = (
  node: T,
  enabled: boolean,
) => {
  data?: { results: T[] };
  isLoading: boolean;
};

const TreeNode = <T,>({ node, level }: { node: T; level: number }) => {
  const {
    getKey,
    getHasChildren,
    renderItem,
    useChildren,
    expandedNodes,
    onToggleExpand,
  } = useTreeContext<T>();

  const key = getKey(node);
  const isExpanded = expandedNodes.has(key);
  const { data: childrenData, isLoading } = useChildren(node, isExpanded);
  const hasChildren = getHasChildren?.(node);

  if (!node) return null;

  return (
    <div
      className={cn("flex flex-col", level > 0 && "pl-4 border-muted border-l")}
    >
      <div className="flex items-center gap-1 hover:bg-accent px-2 py-1 rounded-sm transition-colors hover:text-accent-foreground">
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(key);
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
        {renderItem(node)}
      </div>

      {isExpanded && childrenData?.results.length && (
        <div className="flex flex-col mt-1">
          {childrenData.results.map((child) => (
            <TreeNode key={getKey(child)} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

type TreeViewProps<T> = {
  isLoading: boolean;
  isSearching: boolean;
  results?: T[];
  getKey: (node: T) => string | number;
  getHasChildren?: (node: T) => boolean;
  renderItem: (node: T) => ReactNode;
  useChildren: UseChildrenHook<T>;
  className?: string;
};

const TreeView = <T,>(props: TreeViewProps<T>) => {
  const { isLoading, isSearching, results, getKey, renderItem, className } =
    props;
  const [expandedNodes, setExpandedNodes] = useState<Set<number | string>>(
    new Set(),
  );

  const handleToggleExpand = (nodeId: number | string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);

      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);

      return next;
    });
  };

  return (
    <TreeContext.Provider
      value={{ ...props, expandedNodes, onToggleExpand: handleToggleExpand }}
    >
      <div className={cn("p-2 overflow-y-auto", className)}>
        {isLoading ? (
          <Spinner />
        ) : results?.length ? (
          <div className="space-y-1">
            {results.map((node) =>
              isSearching ? (
                <div key={getKey(node)}>{renderItem(node)}</div>
              ) : (
                <TreeNode key={getKey(node)} node={node} level={0} />
              ),
            )}
          </div>
        ) : (
          <CommandEmpty className="py-6 text-sm text-center">
            No units found.
          </CommandEmpty>
        )}
      </div>
    </TreeContext.Provider>
  );
};

export default TreeView;
