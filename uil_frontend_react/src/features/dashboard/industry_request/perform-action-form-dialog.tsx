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
import { usePerformActionMutation } from "@/data/industry_requests/industry_request-perform-action-mutation";
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
  ACTION_CONFIG,
  ActionFormFields,
  FormFieldConfig,
} from "./utils.industry_request-actions";

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

  const SELECT_CONFIGS = {
    user: {
      query: usersQuery,
      searchPlaceholder: "User",
      setParams: setUserParams,
      getLabel: (item: UserProfile) => getFullName(item),
      getDisplayValue: (value: number, data?: any) =>
        data?.results?.find((u: UserProfile) => u.id === value)
          ? getFullName(data.results.find((u: UserProfile) => u.id === value))
          : "Selected",
      placeholder: "Select a user...",
    },
    industry: {
      query: industriesQuery,
      searchPlaceholder: "Industries",
      setParams: setIndustryParams,
      getLabel: (item: IndustryResponse) => item.name,
      getDisplayValue: (value: number, data?: any) =>
        data?.results?.find((i: IndustryResponse) => i.id === value)?.name ??
        "Selected",
      placeholder: "Select industry...",
    },
  };

  switch (field.type) {
    case "textarea":
      return <FormTextArea {...commonProps} key={commonProps.name} />;

    case "date":
    case "text":
    case "number":
    case "checkbox":
      return (
        <FormInput {...commonProps} key={commonProps.name} type={field.type} />
      );

    case "file":
      return <FormUploadFile {...commonProps} key={commonProps.name} />;

    case "select": {
      const labelLower = field.label.toLowerCase();

      // 1. Handle TreeSelect (Units) separately as it's a different component
      if (labelLower.includes("unit")) {
        return (
          <TreeSelectOrgUnit
            {...commonProps}
            variant="form"
            key={commonProps.name}
          />
        );
      }

      // 2. Determine if we are dealing with a User or Industry
      const type = labelLower.includes("assign")
        ? "user"
        : labelLower.includes("industry")
          ? "industry"
          : null;

      if (!type) return null;

      const config = SELECT_CONFIGS[type];

      return (
        <FormCombobox
          {...commonProps}
          key={commonProps.name}
          multiple
          placeholder={config.placeholder}
          query={config.query}
          checkEmpty={(data) => data.results.length === 0}
          onSearch={(search) => config.setParams({ search })}
          searchPlaceholder={`Search ${config.searchPlaceholder}...`}
          getDisplayValue={config.getDisplayValue}
          position="popper"
        >
          {(data) => {
            const selectedValues = (
              Array.isArray(form.watch(commonProps.name))
                ? form.watch(commonProps.name)
                : []
            ) as (string | number)[];

            return (
              <CommandGroup>
                {data.results.map((item: any) => {
                  const selected = selectedValues.includes(item.id);

                  return (
                    <CommandItem
                      key={item.id}
                      onSelect={() => {
                        const updatedValues = selected
                          ? selectedValues.filter((id) => id !== item.id)
                          : [...selectedValues, item.id];

                        form.setValue(commonProps.name, updatedValues as any);
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
};

const PerformActionFormDialog = ({
  request,
  actionType,
  open,
  onOpenChange,
  from_entity,
  to_entity,
}: PerformActionDialogProps) => {
  const config = actionType ? ACTION_CONFIG[actionType] : null;
  const form = useDynamicForm(config?.formFields || []);

  const { mutate, isPending } = usePerformActionMutation();

  const onSubmit = (data: Record<ActionFormFields, string | number>) => {
    let formattedData: Record<ActionFormFields, any> = {
      ...data,
      type: actionType,
      id: request.id,
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
