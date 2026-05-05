import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Props<T> = {
  onSelect?: (node: T) => void;
  node: T;
  children: (node: T) => ReactNode;
  className?: string;
};

const TreeItem = <T,>({ onSelect, node, children, className }: Props<T>) => {
  return (
    <div
      onClick={() => onSelect?.(node)}
      className={cn(
        "flex items-center gap-2 py-1 cursor-pointer grow",
        className,
      )}
    >
      {children(node)}
    </div>
  );
};

export default TreeItem;
