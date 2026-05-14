/* eslint-disable react-hooks/set-state-in-effect */
import { useDebounce } from "@/hooks/use-debounce";
import { OrgUnitResponse } from "@/types/interfaces.org_units";
import { useEffect, useState } from "react";
import { useGetOrgUnitDetail } from "./org_unit-detail-query";
import { useGetOrgUnitDirectChildrenList } from "./org_units-direct-children-list-query";
import { useGetOrgUnitsList } from "./org_units-list-query";

export const useOrgUnitTree = (
  onSelectAction?: (id: number) => void,
  selectedId?: number,
  otherOption?: OrgUnitResponse,
) => {
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

  // When Editing
  const { data: selectedNodeData } = useGetOrgUnitDetail(
    selectedId,
    selectedId !== otherOption?.id,
  );

  const handleSelect = (node: OrgUnitResponse) => {
    setSelectedNode(node);
    onSelectAction?.(node.id);
    setOpen(false);
    setSearchQuery("");
  };

  useEffect(() => {
    if (selectedId === null && otherOption) {
      setSelectedNode(otherOption!);
      return;
    }

    if (!selectedId) {
      setSelectedNode(null);
      return;
    }

    if (selectedNodeData) {
      setSelectedNode(selectedNodeData);
    }
  }, [selectedId, selectedNodeData, otherOption]);

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
