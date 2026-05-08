import {
  FormCombobox,
  FormInput,
  FormTextArea,
  FormUploadFile,
} from "@/components/reusable/form-components";
import TreeSelectOrgUnit from "@/components/reusable/tree-select-org_unit";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useIndustryRequestCreateMutation } from "@/data/industry_requests/industry/industry_request-create-mutation";
import { useIndustryRequestUpdateMutation } from "@/data/industry_requests/industry/industry_request-update-mutation";
import { IndustryRequestType } from "@/lib/enums";
import { INDUSTRY_REQUEST_HINTS, RequestHint } from "@/lib/mappings";
import { formatSelectOptions } from "@/lib/utils";
import { RequestDetailResponse } from "@/types/interfaces.requests";
import {
  IndustryRequestCreateInput,
  industryRequestCreateSchema,
  industryRequestDefaultValues,
  IndustryRequestUpdateInput,
  industryRequestUpdateSchema,
} from "@/validation/validation.requests";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type Props = {
  requestToEdit?: RequestDetailResponse;
};

const CreateEditIndustryRequestsForm = ({ requestToEdit }: Props) => {
  const navigate = useNavigate();
  const isEditing = !!requestToEdit;

  const defaultValues = useMemo(() => {
    if (isEditing && requestToEdit) {
      return {
        ...requestToEdit,
        academic_unit: requestToEdit.academic_unit.id,
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

  const selectedType = useWatch({
    control: form.control,
    name: "type",
  }) as IndustryRequestType;

  // Helper to get dynamic description hints
  const descriptionContent = useMemo((): RequestHint => {
    if (!selectedType) {
      return {
        placeholder: "Please select a type first...",
        helpText: "Select a request type to enable this field.",
      };
    }

    // Direct lookup from the mapping file
    return INDUSTRY_REQUEST_HINTS[selectedType];
  }, [selectedType]);

  const { mutate: createMutation, isPending: isCreating } =
    useIndustryRequestCreateMutation();
  const { mutate: updateMutation, isPending: isUpdating } =
    useIndustryRequestUpdateMutation(requestToEdit?.id);
  const isSubmitting = isCreating || isUpdating;

  const onSubmit = async (
    data: IndustryRequestCreateInput | IndustryRequestUpdateInput,
  ) => {
    const mutation = isEditing ? updateMutation : createMutation;
    mutation(data as any, {
      onSuccess: () => {
        if (!isEditing) form.reset();
        navigate("/dashboard/industry/requests");
      },
    });
  };

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
        required
      />

      <FormCombobox
        form={form}
        name="type"
        label="Request Type"
        options={formatSelectOptions(Object.values(IndustryRequestType))}
        placeholder="Select type"
        required
      />

      <div className="col-span-full">
        <FormTextArea
          form={form}
          name="description"
          label="Description"
          placeholder={descriptionContent.placeholder}
          desc={descriptionContent.helpText}
          disabled={!selectedType}
          required
          className="min-h-30"
        />
      </div>

      <TreeSelectOrgUnit form={form} />

      <FormUploadFile
        form={form}
        name="attachment"
        label="Attachment"
        desc="Upload supporting documents (PDF, DOCX, ZIP)."
        accept=".pdf,.doc,.docx,.zip,.png,.jpg"
        maxSizeMB={5}
      />

      <Button
        type="submit"
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
