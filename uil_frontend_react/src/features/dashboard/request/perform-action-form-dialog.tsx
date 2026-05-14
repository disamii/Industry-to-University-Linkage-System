/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FormCombobox,
  FormInput,
  FormTextArea,
  FormUploadFile,
} from "@/components/reusable/form-components";
import TreeSelectOrgUnit from "@/components/reusable/tree-select-org_unit";
import { Button } from "@/components/ui/button";
import { CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useGetIndustryList } from "@/data/industry/industry-list-query";
import { usePerformActionMutation } from "@/data/requests/request-perform-action-mutation";
import { useUserParams } from "@/data/user/use-user-params";
import { useGetUsers } from "@/data/user/user-list-query";
import { useDynamicForm } from "@/hooks/use-dynamic-form";
import { ActionType, Entity } from "@/lib/enums";
import { cn, getFullName } from "@/lib/utils";
import { IndustryResponse } from "@/types/interfaces.industry";
import { UserProfile } from "@/types/interfaces.user";
import { Check } from "lucide-react";
import { useEffect } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { useIndustryParams } from "../../../data/industry/use-industry-params";
import {
  ActionFormFields,
  FormFieldConfig,
  getActionTypeConfig,
} from "./utils.request-actions";

type FormFieldProps<T extends FieldValues> = {
  field: FormFieldConfig;
  form: UseFormReturn<T>;
};

const FormField = <T extends FieldValues>({
  field,
  form,
}: FormFieldProps<T>) => {
  const { setParams: setIndustryParams } = useIndustryParams();
  const { setParams: setUserParams } = useUserParams();

  const industriesQuery = useGetIndustryList();
  const usersQuery = useGetUsers();

  const { name, label, placeholder, isOptional } = field;
  const commonProps = {
    form,
    name: name as any,
    label,
    placeholder,
    required: !isOptional,
  };

  // --- 1. CONDITIONAL VISIBILITY LOGIC ---
  // Watch the value of 'pi_user' from the form state
  const piUserValue = form.watch("pi_user" as any);

  // If this specific field instance is 'assigned_users' and 'pi_user' is empty, don't render it
  if (name === "assigned_users" && !piUserValue) {
    return null;
  }
  // ----------------------------------------

  // Update config detection for 'pi_user' as well
  const isUserField =
    label.toLowerCase().includes("assign") || name === "pi_user";

  const SELECT_CONFIGS = {
    user: {
      query: usersQuery,
      searchPlaceholder: "User",
      setParams: setUserParams,
      getLabel: (item: UserProfile) => getFullName(item),
      getDisplayValue: (value: any, data?: any) => {
        // Handle both single value and array display lookup
        const lookupId = Array.isArray(value) ? value[0] : value;
        const found = data?.results?.find(
          (u: UserProfile) => u.id === lookupId,
        );
        return found ? getFullName(found) : "Selected";
      },
      placeholder:
        name === "pi_user"
          ? "Select a team leader..."
          : "Select other experts...",
    },
    industry: {
      query: industriesQuery,
      searchPlaceholder: "Industries",
      setParams: setIndustryParams,
      getLabel: (item: IndustryResponse) => item.name,
      getDisplayValue: (value: any, data?: any) => {
        const lookupId = Array.isArray(value) ? value[0] : value;
        return (
          data?.results?.find((i: IndustryResponse) => i.id === lookupId)
            ?.name ?? "Selected"
        );
      },
      placeholder: "Select industry...",
    },
  };

  switch (field.type) {
    case "textarea":
      return <FormTextArea {...commonProps} key={commonProps.name} />;

    case "date":
    case "text":
    case "number":
      return (
        <FormInput {...commonProps} key={commonProps.name} type={field.type} />
      );

    case "checkbox":
      return (
        <div className="bg-muted/50 p-3 rounded-lg">
          <FormInput
            {...commonProps}
            key={commonProps.name}
            type={field.type}
          />
        </div>
      );

    case "file":
      return <FormUploadFile {...commonProps} key={commonProps.name} />;

    case "select": {
      const labelLower = field.label.toLowerCase();

      if (labelLower.includes("unit")) {
        return (
          <TreeSelectOrgUnit
            {...commonProps}
            variant="form"
            key={commonProps.name}
          />
        );
      }

      const type = isUserField
        ? "user"
        : labelLower.includes("industry")
          ? "industry"
          : null;
      if (!type) return null;

      const config = SELECT_CONFIGS[type];
      const isMultiple = commonProps.name !== "pi_user";

      return (
        <FormCombobox
          {...commonProps}
          key={commonProps.name}
          multiple={isMultiple}
          placeholder={config.placeholder}
          query={config.query}
          checkEmpty={(data) => !data || data.results.length === 0}
          onSearch={(search) => config.setParams({ search })}
          searchPlaceholder={`Search ${config.searchPlaceholder}...`}
          getDisplayValue={config.getDisplayValue}
          position="popper"
        >
          {(data, setOpen) => {
            // --- 2. MIXED SINGLE/MULTIPLE VALUE LOGIC ---
            const formValue = form.watch(commonProps.name);

            // Normalize selected state check depending on mode
            const isSelected = (id: string | number) => {
              if (isMultiple) {
                return Array.isArray(formValue)
                  ? formValue.includes(id)
                  : false;
              }
              return formValue === id;
            };

            return (
              <CommandGroup>
                {data.results
                  .filter((item: any) => {
                    // Remove selected PI from assigned users options
                    if (commonProps.name === "assigned_users") {
                      return item.id !== piUserValue;
                    }

                    return true;
                  })
                  .map((item: any) => {
                    const selected = isSelected(item.id);

                    return (
                      <CommandItem
                        key={item.id}
                        onSelect={() => {
                          if (isMultiple) {
                            // Multiple Selection (Array management)
                            const currentValues = Array.isArray(formValue)
                              ? formValue
                              : [];
                            const updatedValues = selected
                              ? ((currentValues as any) || []).filter(
                                  (id: number) => id !== item.id,
                                )
                              : [...currentValues, item.id];
                            form.setValue(
                              commonProps.name,
                              updatedValues as any,
                            );
                          } else {
                            // Single Selection (Direct value assignment)
                            // If it's already selected, clear it (or keep it if required)
                            setOpen(false);
                            form.setValue(
                              commonProps.name,
                              (selected ? undefined : item.id) as any,
                            );
                          }
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 w-4 h-4",
                            selected ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {config.getLabel(item as any)}
                      </CommandItem>
                    );
                  })}
              </CommandGroup>
            );
          }}
        </FormCombobox>
      );
    }

    default:
      return null;
  }
};

type PerformActionDialogProps = {
  request: { id: number; title: string };
  actionType: ActionType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  from_entity?: Entity;
  to_entity?: Entity;
  actionToPerform?: "alter" | "create";
};

const PerformActionFormDialog = ({
  request,
  actionType,
  open,
  onOpenChange,
  from_entity,
  to_entity,
  actionToPerform = "create",
}: PerformActionDialogProps) => {
  const config = getActionTypeConfig(actionType);
  const form = useDynamicForm(config?.formFields || []);

  const { mutate, isPending } = usePerformActionMutation();

  const onSubmit = (data: Record<ActionFormFields, string | number>) => {
    let formattedData: Record<ActionFormFields, any> = {
      ...data,
      type: actionType,
      id: request.id,
      actionToPerform,
    };

    if (actionType === ActionType.REPLIED && from_entity && to_entity)
      formattedData = { ...formattedData, from_entity, to_entity };

    mutate(formattedData, {
      onSuccess: () => {
        onOpenChange(false);
        form.reset();
      },
    });
  };

  useEffect(() => {
    if (!open) form.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    form.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionType]);

  if (!config) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25 max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-semibold text-xl">
            {request.title || "Perform Action"}
          </DialogTitle>

          <DialogDescription>
            Fill out the details below to proceed with the{" "}
            <span className="font-semibold">{config.label.toLowerCase()}</span>{" "}
            action.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {config.formFields.map((field) => (
            <FormField key={field.name} field={field} form={form} />
          ))}

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className={cn(
                config.color,
                `hover:${config.color} hover:brightness-95 transition-all`,
              )}
            >
              {isPending ? (
                <>
                  <Spinner variant="small" /> Processing...
                </>
              ) : (
                <>
                  <config.Icon className="size-4" />
                  {config.label}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PerformActionFormDialog;
