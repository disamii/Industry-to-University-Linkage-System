import {
  FormInput,
  FormSelect,
  FormTextArea,
  FormUploadFile,
} from "@/components/reusable/form-components";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useIndustryRequestCreateMutation } from "@/data/industry_requests/industry_request-create-mutation";
import { useIndustryRequestUpdateMutation } from "@/data/industry_requests/industry_request-update-mutation";
import { INDUSTRY_REQUEST_FIELDS } from "@/lib/constants";
import { IndustryRequestType } from "@/lib/enums";
import { formatSelectOptions } from "@/lib/utils";
import { IndustryRequestResponse } from "@/types/interfaces.industry_requests";
import {
  IndustryRequestCreateInput,
  industryRequestCreateSchema,
  industryRequestDefaultValues,
  IndustryRequestUpdateInput,
} from "@/validation/validation.industry_requests";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type Props = {
  requestToEdit?: IndustryRequestResponse;
};

const CreateEditIndustryRequestsForm = ({ requestToEdit }: Props) => {
  const navigate = useNavigate();
  const isEditing = !!requestToEdit;
  const defaultValues = isEditing
    ? requestToEdit
    : industryRequestDefaultValues;

  const form = useForm<IndustryRequestCreateInput>({
    resolver: zodResolver(industryRequestCreateSchema),
    defaultValues,
  });
  const selectedType = useWatch({
    control: form.control,
    name: "type",
  }) as keyof typeof INDUSTRY_REQUEST_FIELDS;

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
          navigate("/dashboard/industry/requests");
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

  useEffect(() => {
    form.setValue("extra_data", {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType]);

  return (
    <form
      id="form-create-edit-request"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8"
    >
      <FormInput
        form={form}
        name="title"
        label="Request Title"
        placeholder="Enter a descriptive title"
        type="text"
        required={true}
      />

      <FormTextArea
        form={form}
        name="description"
        label="Description"
        placeholder="Provide more details about the request..."
        desc="Briefly explain the scope of work."
        required={true}
      />

      <FormSelect
        form={form}
        name="requested_to"
        label="Academic Unit"
        options={[{ label: "BIT", value: 1 }]}
        placeholder="Select type"
        isNumber={true}
        required={true}
      />

      <FormSelect
        form={form}
        name="type"
        label="Request Type"
        options={formatSelectOptions(Object.values(IndustryRequestType))}
        placeholder="Select type"
        required={true}
      />

      {selectedType && (
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
          {INDUSTRY_REQUEST_FIELDS[selectedType]?.map((field) => {
            const name = `extra_data.${field}` as const;

            const props = {
              form: form,
              name: name,
              label: field.replaceAll("_", " "),
              placeholder: "Enter a value",
            };

            // number fields
            if (
              [
                "number_of_trainees",
                "number_of_students",
                "graduate_year",
                "number_to_recruit",
              ].includes(field)
            ) {
              return (
                <FormInput
                  {...props}
                  key={field}
                  type="number"
                  required={true}
                />
              );
            }

            // textarea for longer text
            if (["activities", "requirements"].includes(field)) {
              return (
                <FormTextArea
                  {...props}
                  key={field}
                  placeholder="Enter a value"
                  required={true}
                />
              );
            }

            // default input
            return (
              <FormInput {...props} key={field} type="text" required={true} />
            );
          })}
        </div>
      )}

      <FormUploadFile
        form={form}
        name="attachment"
        label="Attachment"
        desc="Please upload the supporting documents for this project."
        accept=".pdf,.doc,.docx,.zip,.png,.jpg" // Or leave blank for any file
        maxSizeMB={5}
      />

      <Button
        type="submit"
        form="form-create-edit-request"
        disabled={isSubmitting}
        className="w-full h-10"
      >
        {isSubmitting && <Spinner data-icon="inline-start" />}
        {isSubmitting
          ? "Processing..."
          : isEditing
            ? "Edit Request"
            : "Submit Request"}
      </Button>
    </form>
  );
};

export default CreateEditIndustryRequestsForm;
