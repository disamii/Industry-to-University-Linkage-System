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
import { Resolver, useForm, useWatch } from "react-hook-form";
import { getEntityFormConfig, SupportedEntity } from "../request/utils.request";
import z from "zod";
import { RequestHint } from "@/lib/mappings";
import { OTHER_OPTION_ID } from "@/lib/constants";

type Props = {
  requestToEdit?: RequestDetailResponse;
  requesting_entity: SupportedEntity;
  onSuccess?: () => void;
};

const CreateEditRequestsForm = ({
  requestToEdit,
  requesting_entity,
  onSuccess,
}: Props) => {
  const isEditing = !!requestToEdit;

  const formConfig = getEntityFormConfig(requesting_entity);
  type CreateSchema = z.infer<typeof formConfig.schema.create>;
  type UpdateSchema = z.infer<typeof formConfig.schema.update>;
  type FormValues = CreateSchema | UpdateSchema;

  const { mutate: createMutation, isPending: isCreating } =
    useRequestCreateMutation();
  const { mutate: updateMutation, isPending: isUpdating } =
    useRequestUpdateMutation(requestToEdit?.id);
  const isSubmitting = isCreating || isUpdating;

  const industriesQuery = useGetIndustryList(
    requesting_entity !== Entity.INDUSTRY,
  );
  const { setParams: setIndustryParams } = useIndustryParams();

  const defaultValues: FormValues = useMemo(() => {
    if (isEditing && requestToEdit) {
      const entitySpecificFields: Partial<
        Record<Entity, { academic_unit?: number; industry?: number }>
      > = {
        [Entity.INDUSTRY]: {
          academic_unit: requestToEdit.academic_unit.id,
        },

        [Entity.ACADEMIC_UNIT]: {
          academic_unit: requestToEdit.academic_unit.id,
          industry: requestToEdit.industry.id,
        },

        [Entity.STAFF]: {
          academic_unit: requestToEdit.academic_unit.id,
          industry: requestToEdit.industry.id,
        },

        [Entity.STUDENT]: {
          // academic_unit: requestToEdit.academic_unit.id,
          industry: requestToEdit.industry.id,
        },
      };

      const payload = {
        ...requestToEdit,
        ...entitySpecificFields[requesting_entity],
      };

      return payload as FormValues;
    }

    return requestDefaultValues as unknown as FormValues;
  }, [requestToEdit, isEditing, requesting_entity]);

  const form = useForm<FormValues>({
    resolver: zodResolver(
      isEditing ? formConfig.schema.update : formConfig.schema.create,
    ) as Resolver<FormValues>,
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
  const selectedUnit = useWatch({
    control: form.control,
    name: "academic_unit",
  });

  const hintContent = useMemo(() => {
    if (!selectedType) {
      return {
        placeholder: "Please select a type first...",
        helpText: "Select a request type to enable this field.",
      };
    }

    return (formConfig.hints as Record<string, RequestHint>)[selectedType];
  }, [selectedType, formConfig.hints]);

  const onSubmit = (data: FormValues) => {
    const mutation = isEditing ? updateMutation : createMutation;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const academic_unit = (data as any).academic_unit;

    mutation(
      {
        data: {
          ...data,
          academic_unit:
            academic_unit !== OTHER_OPTION_ID ? academic_unit : null,
        },
        requesting_entity,
      },
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
      className="gap-x-6 gap-y-8 grid grid-cols-2 pt-2"
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

      {requesting_entity !== Entity.STAFF && (
        <TreeSelectOrgUnit form={form} other_option_id={OTHER_OPTION_ID} />
      )}

      {selectedUnit === OTHER_OPTION_ID && (
        <FormInput
          form={form}
          name="academic_unit_name"
          label="Academic unit Name"
          placeholder="Specify the department, faculty, or school"
          required
        />
      )}

      {requesting_entity !== Entity.INDUSTRY && (
        <FormCombobox
          form={form}
          name="industry"
          label="Industry"
          placeholder="Select industries..."
          query={industriesQuery}
          checkEmpty={(data) => !data || data.results.length === 0}
          onSearch={(search) => setIndustryParams({ search })}
          searchPlaceholder="Search Industries"
          getDisplayValue={(value, data) =>
            data?.results?.find((i) => i.id === value)?.name ?? "Selected"
          }
          key="industry"
          position="popper"
          multiple
          required
        >
          {(data, setOpen) => {
            const selectedValues = (
              Array.isArray(selectedIndustry) ? selectedIndustry : []
            ) as number[];

            return (
              <CommandGroup>
                {data.results.map((item) => {
                  const selected = selectedValues.includes(item.id);

                  return (
                    <CommandItem
                      key={item.id}
                      onSelect={() => {
                        const updatedValues = selected
                          ? selectedValues.filter((id) => id !== item.id)
                          : [...selectedValues, item.id];

                        form.setValue("industry", updatedValues);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 w-4 h-4",
                          selected ? "opacity-100" : "opacity-0",
                        )}
                      />
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
