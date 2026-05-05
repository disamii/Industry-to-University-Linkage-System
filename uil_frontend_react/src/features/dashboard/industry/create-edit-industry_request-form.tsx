import {
  FormInput,
  FormSelect,
  FormTextArea,
  FormUploadFile,
} from "@/components/reusable/form-components";
import TreeSelectOrgUnit from "@/components/reusable/tree-select-org_unit";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useIndustryRequestCreateMutation } from "@/data/industry_requests/industry/industry_request-create-mutation";
import { useIndustryRequestUpdateMutation } from "@/data/industry_requests/industry/industry_request-update-mutation";
import { IndustryRequestType } from "@/lib/enums";
import { INDUSTRY_REQUEST_FIELDS } from "@/lib/mappings";
import { formatSelectOptions } from "@/lib/utils";
import { IndustryRequestDetailResponse } from "@/types/interfaces.industry_requests";
import {
  IndustryRequestCreateInput,
  industryRequestCreateSchema,
  industryRequestDefaultValues,
  IndustryRequestUpdateInput,
  industryRequestUpdateSchema,
} from "@/validation/validation.industry_requests";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type Props = {
  requestToEdit?: IndustryRequestDetailResponse;
};

const CreateEditIndustryRequestsForm = ({ requestToEdit }: Props) => {
  const navigate = useNavigate();
  const isEditing = !!requestToEdit;
  const defaultValues = useMemo(() => {
    if (isEditing && requestToEdit) {
      return {
        ...requestToEdit,
        academic_unit: requestToEdit.academic_unit.id,
        extra_data: requestToEdit.detail || {},
      };
    }
    return industryRequestDefaultValues;
  }, [requestToEdit, isEditing]);

  const form = useForm<IndustryRequestCreateInput | IndustryRequestUpdateInput>(
    {
      resolver: zodResolver(
        isEditing ? industryRequestUpdateSchema : industryRequestCreateSchema,
      ),
      defaultValues: defaultValues,
    },
  );

  const { mutate: createMutation, isPending: isCreating } =
    useIndustryRequestCreateMutation();
  const { mutate: updateMutation, isPending: isUpdating } =
    useIndustryRequestUpdateMutation(requestToEdit?.id);
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
        navigate("/dashboard/industry/requests");
      },
    });
  };

  const selectedType = useWatch({
    control: form.control,
    name: "type",
  }) as keyof typeof INDUSTRY_REQUEST_FIELDS;

  // Change this:
  useEffect(() => {
    if (!isEditing && selectedType) {
      form.setValue("extra_data", {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType, isEditing]);

  useEffect(() => {
    if (isEditing && requestToEdit) {
      form.reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues, form, isEditing]);

  return (
    <form
      id="form-create-edit-request"
      onSubmit={form.handleSubmit(onSubmit)}
      className="gap-6 space-y-8 grid grid-cols-2"
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
        required={true}
      />

      <TreeSelectOrgUnit form={form} />

      <FormSelect
        form={form}
        name="type"
        label="Request Type"
        options={formatSelectOptions(Object.values(IndustryRequestType))}
        placeholder="Select type"
        required={true}
      />

      {selectedType && (
        <>
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
        </>
      )}

      <FormUploadFile
        form={form}
        name="attachment"
        label="Attachment"
        desc="Please upload the supporting documents for this project."
        accept=".pdf,.doc,.docx,.zip,.png,.jpg"
        maxSizeMB={5}
        className="col-span-full"
      />

      <Button
        type="submit"
        form="form-create-edit-request"
        disabled={isSubmitting}
        className="col-span-full w-full h-10"
      >
        {isSubmitting && <Spinner data-icon="inline-start" />}
        {isSubmitting
          ? "Processing..."
          : isEditing
            ? "Update Request"
            : "Submit Request"}
      </Button>
    </form>
  );
};

export default CreateEditIndustryRequestsForm;
