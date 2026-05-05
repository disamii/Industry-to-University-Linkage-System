import {
  FormInput,
  FormSelect,
  FormTextArea,
  FormUploadFile,
} from "@/components/reusable/form-components";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { industryRequestKeys } from "@/data/industry_requests/industry/keys";
import { industryRequestOfficeKeys } from "@/data/industry_requests/office/keys";
import { useDynamicForm } from "@/hooks/use-dynamic-form";
import { ActionType } from "@/lib/enums";
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

export function ActionDialog({
  requestId,
  actionType,
  open,
  onOpenChange,
}: ActionDialogProps) {
  const queryClient = useQueryClient();
  const config = actionType ? ACTION_CONFIG[actionType] : null;

  const form = useDynamicForm(config?.formFields || []);

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
    switch (field.type) {
      case "textarea":
        return (
          <FormTextArea
            key={field.name}
            form={form}
            name={field.name}
            label={field.label}
            placeholder={field.placeholder}
          />
        );

      case "date":
      case "text":
      case "number":
        return (
          <FormInput
            key={field.name}
            form={form}
            name={field.name}
            label={field.label}
            placeholder={field.placeholder}
            type={field.type}
          />
        );

      case "checkbox":
        return (
          <FormInput
            key={field.name}
            form={form}
            name={field.name}
            label={field.label}
            type="checkbox"
          />
        );

      case "file":
        return (
          <FormUploadFile
            key={field.name}
            form={form}
            name={field.name}
            label={field.label}
          />
        );

      case "select":
        return (
          <FormSelect
            key={field.name}
            form={form}
            name={field.name}
            label={field.label}
            placeholder={field.placeholder}
            options={[
              { value: 1, label: "Option 1" },
              { value: 2, label: "Option 2" },
            ]}
          />
        );

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
}
