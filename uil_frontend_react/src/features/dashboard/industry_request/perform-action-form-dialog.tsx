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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  defaultIndustryParams,
  useGetIndustryList,
} from "@/data/industry/industry-list-query";
import { industryRequestKeys } from "@/data/industry_requests/industry/keys";
import { industryRequestOfficeKeys } from "@/data/industry_requests/office/keys";
import { defaultUserParams, useGetUsers } from "@/data/user/user-list-query";
import { useDynamicForm } from "@/hooks/use-dynamic-form";
import { useUrlParams } from "@/hooks/use-url-params";
import { ActionType } from "@/lib/enums";
import { getFullName } from "@/lib/utils";
import { IndustryResponse } from "@/types/interfaces.industry";
import { UserProfile } from "@/types/interfaces.user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import {
  ACTION_CONFIG,
  FormFieldConfig,
} from "./utils.industry_request-actions";

interface ActionDialogProps {
  requestId: number;
  actionType: ActionType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PerformActionFormDialog = ({
  requestId,
  actionType,
  open,
  onOpenChange,
}: ActionDialogProps) => {
  const queryClient = useQueryClient();
  const { params: industryParams, setParams: setIndustryParams } = useUrlParams(
    defaultIndustryParams,
  );
  const { params: userParams, setParams: setUserParams } =
    useUrlParams(defaultUserParams);

  const config = actionType ? ACTION_CONFIG[actionType] : null;
  const form = useDynamicForm(config?.formFields || []);

  const industriesQuery = useGetIndustryList(industryParams);
  const usersQuery = useGetUsers(userParams);

  useEffect(() => {
    if (!open) form.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    form.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionType]);

  const { mutate, isPending } = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (values: Record<string, any>) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(`Submitting ${actionType} for request ${requestId}:`, values);
      return { success: true };
    },
    onSuccess: () => {
      toast.success(`${config?.label} successful`);
      queryClient.invalidateQueries({
        queryKey: [
          ...industryRequestKeys.detail(requestId),
          ...industryRequestOfficeKeys.detail(requestId),
        ],
      });
      onOpenChange(false);
      form.reset();
    },
    onError: () => toast.error("Something went wrong"),
  });

  if (!config) return null;

  const renderField = (field: FormFieldConfig) => {
    const { name, label, placeholder, hidden, isOptional } = field;
    const commonProps = {
      form,
      key: name,
      name,
      label,
      placeholder,
      hidden,
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
        return <FormTextArea {...commonProps} />;

      case "date":
      case "text":
      case "number":
      case "checkbox":
        return <FormInput {...commonProps} type={field.type} />;

      case "file":
        return <FormUploadFile {...commonProps} />;

      case "select": {
        const labelLower = field.label.toLowerCase();

        // 1. Handle TreeSelect (Units) separately as it's a different component
        if (labelLower.includes("unit")) {
          return <TreeSelectOrgUnit variant="form" {...commonProps} />;
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
                      form.setValue(name, item.id);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25 max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <config.Icon className="size-5" />
            <DialogTitle>{config.label}</DialogTitle>
          </div>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit((v) => mutate(v))}
          className="space-y-4"
        >
          {config.formFields.map(renderField)}

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Processing..." : "Confirm Action"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PerformActionFormDialog;
