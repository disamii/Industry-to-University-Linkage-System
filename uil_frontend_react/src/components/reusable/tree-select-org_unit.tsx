import { Asterisk } from "@/components/reusable/form-components";
import { TreeSelect } from "@/components/reusable/tree-select";
import { UseChildrenHook } from "@/components/reusable/tree-view";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useGetOrgUnitDirectChildrenList } from "@/data/org_unit/org_units-direct-children-list-query";
import { useOrgUnitTree } from "@/data/org_unit/use-org-unit-tree";
import { useUrlParams } from "@/hooks/use-url-params";
import { cn } from "@/lib/utils";
import { OrgUnitResponse } from "@/types/interfaces.org_units";
import { FieldValues, get, Path, UseFormReturn } from "react-hook-form";
import TreeItem from "./tree-item";

type Props<T extends FieldValues> = {
  form?: UseFormReturn<T>;
  variant?: "form" | "filter";
  label?: string;
  name?: Path<T>;
  namespace?: string;
};

const TreeSelectOrgUnit = <T extends FieldValues>({
  form,
  variant = "form",
  label,
  name = "academic_unit" as Path<T>,
  namespace,
}: Props<T>) => {
  const isForm = form && variant === "form";
  const finalKey = namespace
    ? `${namespace}.${name as string}`
    : (name as string);

  const { getParam, setParams, removeParams } = useUrlParams<
    Record<string, number>
  >({
    [finalKey]: undefined,
  });

  const onSelect = (id: number) => {
    if (isForm) {
      form?.setValue(name, id as any, {
        shouldValidate: true,
        shouldDirty: true,
      });
      return;
    } else {
      if (id !== -1) {
        setParams({ [finalKey]: id });
        return;
      }

      removeParams([finalKey]);
    }
  };

  const selectedAcademicUnit = isForm
    ? form.watch(name)
    : getParam(finalKey as any);

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
  const formattedResults = results
    ? !isForm
      ? [{ name: "All Units", id: -1 } as OrgUnitResponse, ...results]
      : results
    : [];

  const useOrgUnitChildren: UseChildrenHook<OrgUnitResponse> = (
    node,
    enabled,
  ) => {
    return useGetOrgUnitDirectChildrenList({ parent_id: node.id }, enabled);
  };

  return (
    <Field className={cn(!isForm && "max-w-40")}>
      {isForm && (
        <FieldLabel htmlFor={name} className="capitalize">
          {label || "Academic Unit"}
          <Asterisk />
        </FieldLabel>
      )}
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
        results={formattedResults}
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
        isForm={isForm}
      />
      {get(form?.formState.errors, name) && (
        <FieldError
          errors={[
            get(form?.formState.errors, name) as {
              message?: string | undefined;
            },
          ]}
        />
      )}{" "}
    </Field>
  );
};

export default TreeSelectOrgUnit;
