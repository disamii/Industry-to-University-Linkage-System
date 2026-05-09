import {
  FormCombobox,
  FormInput,
  FormTextArea,
  FormUploadFile,
} from "@/components/reusable/form-components";
import TreeSelectOrgUnit from "@/components/reusable/tree-select-org_unit";
import { Button } from "@/components/ui/button";
import { CommandGroup, CommandItem } from "@/components/ui/command";
import { Spinner } from "@/components/ui/spinner";
import { useGetIndustryList } from "@/data/industry/industry-list-query";
import { useIndustryParams } from "@/data/industry/use-industry-params";
import { useRequestCreateMutation } from "@/data/requests/request-create-mutation";
import { useRequestUpdateMutation } from "@/data/requests/request-update-mutation";
import { Entity } from "@/lib/enums";
import { cn, formatSelectOptions } from "@/lib/utils";
import { RequestDetailResponse } from "@/types/interfaces.requests";
import { requestDefaultValues } from "@/validation/validation.requests";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { getEntityFormConfig } from "../request/utils.request";

type Props = {
  requestToEdit?: RequestDetailResponse;
  requesting_entity: Entity;
  onSuccess?: () => void;
};

const CreateEditRequestsForm = ({
  requestToEdit,
  requesting_entity,
  onSuccess,
}: Props) => {
  const isEditing = !!requestToEdit;

  const formConfig = getEntityFormConfig(requesting_entity);

  const { mutate: createMutation, isPending: isCreating } =
    useRequestCreateMutation();
  const { mutate: updateMutation, isPending: isUpdating } =
    useRequestUpdateMutation(requestToEdit?.id);
  const isSubmitting = isCreating || isUpdating;

  const industriesQuery = useGetIndustryList(
    requesting_entity === Entity.ACADEMIC_UNIT,
  );
  const { setParams: setIndustryParams } = useIndustryParams();

  const defaultValues = useMemo(() => {
    if (isEditing && requestToEdit) {
      const entitySpecificFields = {
        [Entity.ACADEMIC_UNIT]: {
          academic_unit: requestToEdit.academic_unit.id,
          industry: requestToEdit.industry.id,
        },

        [Entity.INDUSTRY]: {
          // industry: requestToEdit.industry.id,
          academic_unit: requestToEdit.academic_unit.id,
        },
      };

      const payload = {
        ...requestToEdit,
        ...entitySpecificFields[requesting_entity],
      };

      return payload;
    }

    return requestDefaultValues;
  }, [requestToEdit, isEditing, requesting_entity]);

  const form = useForm({
    resolver: zodResolver(
      isEditing ? formConfig.schema.update : formConfig.schema.create,
    ),
    defaultValues,
  });

  const selectedType = useWatch({
    control: form.control,
    name: "type",
  });
  const selectedIndustry = useWatch({
    control: form.control,
    name: "industry",
  });

  const hintContent = useMemo(() => {
    if (!selectedType) {
      return {
        placeholder: "Please select a type first...",
        helpText: "Select a request type to enable this field.",
      };
    }

    return formConfig.hints[selectedType];
  }, [selectedType, formConfig.hints]);

  const onSubmit = async (data: any) => {
    const mutation = isEditing ? updateMutation : createMutation;

    mutation(
      { data, requesting_entity },
      {
        onSuccess: () => {
          if (!isEditing) form.reset();
          onSuccess?.();
        },
      },
    );
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
        options={formatSelectOptions(Object.values(formConfig.types))}
        placeholder="Select type"
        required
      />

      <div className="col-span-full">
        <FormTextArea
          form={form}
          name="description"
          label="Description"
          placeholder={hintContent?.placeholder}
          desc={hintContent?.helpText}
          disabled={!selectedType}
          required
          className="min-h-30"
        />
      </div>

      <TreeSelectOrgUnit form={form} />

      {requesting_entity === Entity.ACADEMIC_UNIT && (
        <FormCombobox
          form={form}
          name="industry"
          label="Industry"
          placeholder="Select industry..."
          query={industriesQuery}
          checkEmpty={(data) => data.results.length === 0}
          onSearch={(search) => setIndustryParams({ search })}
          searchPlaceholder="Search Industries"
          getDisplayValue={(value, data) =>
            data?.results?.find((i) => i.id === value)?.name ?? "Selected"
          }
          position="popper"
          required
        >
          {(data, setOpen) => {
            return (
              <CommandGroup>
                {data.results.map((item) => {
                  return (
                    <CommandItem
                      key={item.id}
                      value={item.name}
                      onSelect={() => {
                        form.setValue("industry", item.id, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        setOpen(false);
                      }}
                    >
                      {selectedIndustry === item.id && (
                        <Check className="size-4" />
                      )}
                      {item.name}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            );
          }}
        </FormCombobox>
      )}

      <FormUploadFile
        form={form}
        name="attachment"
        label="Attachment"
        desc="Upload supporting documents (PDF, DOCX, ZIP)."
        accept=".pdf,.doc,.docx,.zip,.png,.jpg"
        maxSizeMB={5}
        className={cn(
          requesting_entity === Entity.ACADEMIC_UNIT && "col-span-full",
        )}
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

export default CreateEditRequestsForm;
