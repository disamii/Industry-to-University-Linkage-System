"use client";

import {
  FormInput,
  FormSelect,
  FormTextArea,
} from "@/components/dashboard/forms/form-components-modified";
import SubmitButton from "@/components/dashboard/forms/submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useIndustryRequestCreateMutation } from "@/data/industry_requests/industry_request-create-mutation";
import { useIndustryRequestUpdateMutation } from "@/data/industry_requests/industry_request-update-mutation";
import { formatSelectOptions } from "@/lib/utils";
import { IndustryRequestResponse } from "@/types/interfaces.industry_requests";
import {
  IndustryRequestCreateInput,
  industryRequestCreateSchema,
  industryRequestDefaultValues,
  IndustryRequestUpdateInput,
} from "@/validation/validation.industry_requests";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { RequestPriority, RequestType } from "@/lib/enums";

type Props = {
  requestToEdit?: IndustryRequestResponse;
};

const CreateEditIndustryRequestsForm = ({ requestToEdit }: Props) => {
  const router = useRouter();
  const isEditing = !!requestToEdit;
  const defaultValues = isEditing
    ? requestToEdit
    : industryRequestDefaultValues;

  const form = useForm<IndustryRequestCreateInput>({
    resolver: zodResolver(industryRequestCreateSchema),
    defaultValues,
  });

  const { mutate: createMutation, isPending: isCreating } =
    useIndustryRequestCreateMutation();
  const { mutate: updateMutation, isPending: isUpdating } =
    useIndustryRequestUpdateMutation(requestToEdit?.id || "");
  const isSubmitting = isCreating || isUpdating;

  const onSubmit = async (
    data: IndustryRequestCreateInput | IndustryRequestUpdateInput,
  ) => {
    if (isEditing) {
      updateMutation(data as IndustryRequestUpdateInput, {
        onSuccess: () => {
          router.push("/dashboard/industry/requests");
        },
      });
      return;
    }

    createMutation(data as IndustryRequestCreateInput, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return (
    <form
      id="form-create-edit-request"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8"
    >
      <Card className="bg-card shadow-sm border-border/50 rounded-[2.5rem]">
        <CardContent className="space-y-8 p-4 md:px-8">
          <FormInput
            form={form}
            name="title"
            label="Project Title"
            placeholder="Enter a descriptive title"
            type="text"
          />

          <FormTextArea
            form={form}
            name="description"
            label="Description"
            placeholder="Provide more details about the request..."
            desc="Briefly explain the scope of work."
          />

          <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
            <FormSelect
              form={form}
              name="type"
              label="Request Type"
              placeholder="Select type"
              options={formatSelectOptions(Object.values(RequestType))}
            />

            <FormSelect
              form={form}
              name="priority"
              label="Priority Level"
              placeholder="Select priority"
              options={formatSelectOptions(Object.values(RequestPriority))}
            />

            <FormInput
              form={form}
              name="budget_required"
              label="Budget Required"
              placeholder="0.00"
              type="number"
            />
          </div>
        </CardContent>

        <CardFooter className="md:flex-row flex-col-reverse justify-center md:justify-end gap-3">
          <Link href="/dashboard/industry" className="w-full md:w-fit">
            <Button
              variant="secondary"
              type="button"
              className="hover:bg-accent px-10 rounded-2xl w-full md:w-fit h-12 font-bold text-muted-foreground"
            >
              Cancel
            </Button>
          </Link>

          <SubmitButton
            label={isEditing ? "Edit Request" : "Submit Request"}
            form="form-create-edit-request"
            className="w-full md:w-fit"
            isSubmitting={isSubmitting}
          />
        </CardFooter>
      </Card>
    </form>
  );
};

export default CreateEditIndustryRequestsForm;
