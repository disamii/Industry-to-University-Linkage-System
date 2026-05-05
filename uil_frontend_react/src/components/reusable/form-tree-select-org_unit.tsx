import { Asterisk } from "@/components/reusable/form-components";
import { TreeSelect } from "@/components/reusable/tree-select";
import { UseChildrenHook } from "@/components/reusable/tree-view";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useGetOrgUnitDirectChildrenList } from "@/data/org_unit/org_units-direct-children-list-query";
import { useOrgUnitTree } from "@/data/org_unit/use-org-unit-tree";
import { OrgUnitResponse } from "@/types/interfaces.org_units";
import {
  IndustryRequestCreateInput,
  IndustryRequestUpdateInput,
} from "@/validation/validation.industry_requests";
import { UseFormReturn, useWatch } from "react-hook-form";
import TreeItem from "./tree-item";

type Props = {
  form: UseFormReturn<IndustryRequestCreateInput | IndustryRequestUpdateInput>;
};

const FormTreeSelectOrgUnit = ({ form }: Props) => {
  const onSelect = (id: number) => {
    form.setValue("academic_unit", id, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };
  const selectedAcademicUnit = useWatch({
    control: form.control,
    name: "academic_unit",
  });

  const {
    searchQuery,
    setSearchQuery,
    open,
    setOpen,
    isSearching,
    isLoading,
    results,
    selectedNode,
    handleSelect,
  } = useOrgUnitTree(onSelect, selectedAcademicUnit);

  const useOrgUnitChildren: UseChildrenHook<OrgUnitResponse> = (
    node,
    enabled,
  ) => {
    return useGetOrgUnitDirectChildrenList({ parent_id: node.id }, enabled);
  };

  return (
    <Field>
      <FieldLabel htmlFor="academic_unit" className="capitalize">
        Academic Unit
        <Asterisk />
      </FieldLabel>

      <TreeSelect
        selectedId={selectedAcademicUnit}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        DisplaySelectedItem={
          <span className="truncate">
            {selectedNode ? selectedNode?.name : "Choose a unit..."}
          </span>
        }
        getHasChildren={(node) => node.total_subnodes > 0}
        getKey={(node) => node.id}
        isLoading={isLoading}
        results={results}
        isSearching={isSearching}
        renderItem={(node) => (
          <TreeItem onSelect={handleSelect} node={node}>
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
        open={open}
        setOpen={setOpen}
        useChildren={useOrgUnitChildren}
      />

      {form.formState.errors.academic_unit && (
        <FieldError errors={[form.formState.errors.academic_unit]} />
      )}
    </Field>
  );
};

export default FormTreeSelectOrgUnit;
