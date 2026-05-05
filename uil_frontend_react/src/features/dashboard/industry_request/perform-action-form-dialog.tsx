import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { FormInput, FormTextArea } from "@/components/reusable/form-components";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ActionType } from "@/lib/enums";
import toast from "react-hot-toast";
import { ACTION_CONFIG } from "./utils.industry_request-actions";

// Comprehensive schema covering all possible action fields
const actionFormSchema = z.object({
  description: z.string().min(5, "Description is too short").optional(),
  assigned_user: z.string().min(1, "Please select a user").optional(),
  start_date: z.string().min(1, "Required").optional(),
  end_date: z.string().min(1, "Required").optional(),
  industry_mentor: z.string().optional(),
  title: z.string().min(3, "Title is required").optional(),
  content: z.string().min(10, "Content is too short").optional(),
  from_unit: z.string().optional(),
  to_unit: z.string().optional(),
});

type ActionFormValues = z.infer<typeof actionFormSchema>;

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

  const form = useForm<ActionFormValues>({
    resolver: zodResolver(actionFormSchema),
    defaultValues: {
      description: "",
      assigned_user: "",
      title: "",
      content: "",
    },
  });

  // Mimicking Backend Call
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: ActionFormValues) => {
      // Simulate API Delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(`Submitting ${actionType} for request ${requestId}:`, values);
      return { success: true };
    },
    onSuccess: () => {
      toast.success(`${config?.label} successful`);
      queryClient.invalidateQueries({
        queryKey: ["industry-requests", requestId],
      });
      onOpenChange(false);
      form.reset();
    },
    onError: () => toast.error("Something went wrong"),
  });

  if (!config) return null;

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
          {/* Dynamically render only the fields defined in ACTION_CONFIG */}
          {config.formFields.map((fieldName) => {
            const isTextArea = ["description", "content"].includes(fieldName);
            const inputType = ["date", "expires_at"].includes(fieldName)
              ? "date"
              : "text";

            if (isTextArea)
              return (
                <FormTextArea
                  form={form}
                  name={fieldName as any}
                  label={fieldName.replace("_", " ")}
                />
              );

            return (
              <FormInput
                form={form}
                name={fieldName as any}
                label={fieldName.replace("_", " ")}
                type={inputType}
              />
            );
          })}

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
