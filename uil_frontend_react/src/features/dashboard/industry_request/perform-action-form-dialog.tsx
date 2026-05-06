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
import {
  defaultIndustryParams,
  useGetIndustryList,
} from "@/data/industry/industry-list-query";
import { usePerformActionMutation } from "@/data/industry_requests/industry_request-perform-action-mutation";
import { defaultUserParams, useGetUsers } from "@/data/user/user-list-query";
import { useDynamicForm } from "@/hooks/use-dynamic-form";
import { useUrlParams } from "@/hooks/use-url-params";
import { ActionType, Entity } from "@/lib/enums";
import { cn, getFullName } from "@/lib/utils";
import { IndustryResponse } from "@/types/interfaces.industry";
import { UserProfile } from "@/types/interfaces.user";
import { useEffect } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import {
  ACTION_CONFIG,
  ActionFormFields,
  FormFieldConfig,
} from "./utils.industry_request-actions";
import { Spinner } from "@/components/ui/spinner";

type FormFieldProps<T extends FieldValues> = {
  field: FormFieldConfig;
  form: UseFormReturn<T>;
};

const FormField = <T extends FieldValues>({
  field,
  form,
}: FormFieldProps<T>) => {
  const { params: industryParams, setParams: setIndustryParams } = useUrlParams(
    defaultIndustryParams,
  );
  const { params: userParams, setParams: setUserParams } =
    useUrlParams(defaultUserParams);

  const industriesQuery = useGetIndustryList(industryParams);
  const usersQuery = useGetUsers(userParams);

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
      placeholder: "Select a user...",
    },
    industry: {
      query: industriesQuery,
      searchPlaceholder: "Industries",
      setParams: setIndustryParams,
      getLabel: (item: IndustryResponse) => item.name,
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
          placeholder={config.placeholder}
          query={config.query}
          checkEmpty={(data) => data.results.length === 0}
          onSearch={(search) => config.setParams({ search })}
          searchPlaceholder={`Search ${config.searchPlaceholder}...`}
          position="popper"
        >
          {(data, setOpen) => (
            <CommandGroup>
              {data.results.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => {
                    form.setValue(commonProps.name, item.id as any);
                    setOpen(false);
                  }}
                >
                  {config.getLabel(item as any)}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
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
