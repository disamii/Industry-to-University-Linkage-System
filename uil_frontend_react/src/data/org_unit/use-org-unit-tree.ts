import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useGetOrgUnitDirectChildrenList } from "./org_units-direct-children-list-query";
import { useGetOrgUnitsList } from "./org_units-list-query";
import { OrgUnitResponse } from "@/types/interfaces.org_units";

export const useOrgUnitTree = (onSelectAction: (id: number) => void) => {
  const [selectedNode, setSelectedNode] = useState<OrgUnitResponse | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const isSearching = searchQuery.length > 0;

  // Root units fetch
  const { data: rootData, isLoading: isRootDataLoading } =
    useGetOrgUnitDirectChildrenList();

  // Search fetch
  const { data: searchResults, isLoading: isSearchLoading } =
    useGetOrgUnitsList({ search: debouncedSearch as string }, isSearching);

  const handleSelect = (node: OrgUnitResponse) => {
    setSelectedNode(node);
    onSelectAction(node.id);
    setOpen(false);
    setSearchQuery("");
  };

  return {
    searchQuery,
    setSearchQuery,
    open,
    setOpen,
    isSearching,
    isLoading: isSearching ? isSearchLoading : isRootDataLoading,
    results: isSearching ? searchResults?.results : rootData?.results,
    handleSelect,
    selectedNode,
  };
};
