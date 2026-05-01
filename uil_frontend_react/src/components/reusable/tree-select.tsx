import { Button } from "@/components/ui/button";
import { Command, CommandInput } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { OrgUnitResponse } from "@/types/interfaces.org_units";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import TreeView from "./tree-view";

interface TreeSelectProps {
  onSelect?: (node: OrgUnitResponse) => void;
  selectedId?: number;
  placeholder?: string;
  className?: string;
}

export function TreeSelect({
  onSelect,
  placeholder = "Select an organizational unit...",
  className,
}: TreeSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNode, setSelectedNode] = useState<OrgUnitResponse | null>(
    null,
  );
  const debouncedSearch = useDebounce(searchQuery, 300);

  const handleSelect = (node: OrgUnitResponse) => {
    setSelectedNode(node);
    onSelect?.(node);
    setOpen(false);
    setSearchQuery("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between py-5 w-full font-normal", className)}
        >
          <span className="truncate">
            {selectedNode ? selectedNode.name : placeholder}
          </span>
          <ChevronDown className="opacity-50 ml-2 w-4 h-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search units..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />

          <TreeView
            onSelect={handleSelect}
            searchQuery={debouncedSearch as string}
          />
        </Command>
      </PopoverContent>
    </Popover>
  );
}
