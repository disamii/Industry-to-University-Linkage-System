import { UseChildrenHook } from "@/components/reusable/tree-view";
import { createContext, useContext, ReactNode } from "react";

interface TreeContextProps<T> {
  getKey: (node: T) => string | number;
  getHasChildren?: (node: T) => boolean;
  renderItem: (node: T) => ReactNode;
  useChildren: UseChildrenHook<T>;
  expandedNodes: Set<number | string>;
  onToggleExpand: (nodeId: number | string) => void;
}

const TreeContext = createContext<TreeContextProps<any> | null>(null);

const useTreeContext = <T,>() => {
  const context = useContext(TreeContext);
  if (!context) throw new Error("TreeNode must be used within TreeView");
  return context as TreeContextProps<T>;
};

export { TreeContext, useTreeContext };
