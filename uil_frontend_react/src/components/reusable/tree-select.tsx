import { Button } from "@/components/ui/button";
import { Command, CommandInput } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { Dispatch, ReactNode, SetStateAction } from "react";
import TreeView, { UseChildrenHook } from "./tree-view";

type Props<T> = {
  // Searching
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  isSearching: boolean;

  // Selecting
  selectedId?: number;

  // Label displayed on the popover trigger
  DisplaySelectedItem: ReactNode;

  // Root Data
  isLoading: boolean;
  results?: T[];

  // getter functions
  getHasChildren: (node: T) => boolean;
  getKey: (node: T) => string | number;

  // Children
  renderItem: (node: T) => ReactNode;

  // Popover controls
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;

  useChildren: UseChildrenHook<T>;
  isForm?: boolean;
};

export const TreeSelect = <T,>({
  searchQuery,
  setSearchQuery,
  DisplaySelectedItem,
  getHasChildren,
  getKey,
  isLoading,
  results,
  isSearching,
  renderItem,
  open,
  setOpen,
  useChildren,
  isForm,
}: Props<T>) => {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between py-5 w-full font-normal",
            !isForm && "py-0 max-w-40!",
          )}
        >
          <>
            {DisplaySelectedItem}
            <ChevronDown className="opacity-50 ml-2 w-4 h-4 shrink-0" />
          </>
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
            getHasChildren={getHasChildren}
            getKey={getKey}
            isLoading={isLoading}
            results={results}
            isSearching={isSearching}
            renderItem={renderItem}
            useChildren={useChildren}
            className="max-h-80"
          />
        </Command>
      </PopoverContent>
    </Popover>
  );
};
