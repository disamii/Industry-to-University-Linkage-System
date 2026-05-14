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
import { Entity } from "@/lib/enums";
import { useMemo } from "react";

type Props<T extends FieldValues> = {
  form?: UseFormReturn<T>;
  variant?: "form" | "filter";
  label?: string;
  name?: Path<T>;
  namespace?: string;
  other_option_id?: number;
  requesting_entity?: Entity;
};

const TreeSelectOrgUnit = <T extends FieldValues>({
  form,
  variant = "form",
  label,
  name = "academic_unit" as Path<T>,
  namespace,
  other_option_id,
  requesting_entity,
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

  const otherOption = useMemo(
    () =>
      ({
        name: "Other/Not listed here",
        id: other_option_id,
      }) as OrgUnitResponse,
    [other_option_id],
  );

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
  } = useOrgUnitTree(onSelect, selectedAcademicUnit, otherOption);

  const getFormattedResults = () => {
    if (!results) return [];

    if (!isForm) {
      return [{ name: "All Units", id: -1 } as OrgUnitResponse, ...results];
    } else {
      if (other_option_id && requesting_entity === Entity.INDUSTRY)
        return [...results, otherOption];

      return results;
    }
  };

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
        results={getFormattedResults()}
        isSearching={isSearching}
        renderItem={(node) => (
          <TreeItem onSelect={handleSelect} node={node}>
            {() => (
              <>
                <span
                  className={cn(
                    "font-medium text-sm truncate",
                    node.id === other_option_id &&
                      "text-muted-foreground font-normal italic",
                  )}
                >
                  {node.name}
                </span>
                {node.unit_type && (
                  <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] text-muted-foreground uppercase tracking-wider">
                    {node.unit_type}
                  </span>
                )}
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
