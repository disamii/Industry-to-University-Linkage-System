import {
  Asterisk,
  FormInput,
  FormSelect,
  FormTextArea,
  FormUploadFile,
} from "@/components/reusable/form-components";
import { TreeSelect } from "@/components/reusable/tree-select";
import { UseChildrenHook } from "@/components/reusable/tree-view";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useIndustryRequestCreateMutation } from "@/data/industry_requests/industry_request-create-mutation";
import { useIndustryRequestUpdateMutation } from "@/data/industry_requests/industry_request-update-mutation";
import { useGetOrgUnitDirectChildrenList } from "@/data/org_unit/org_units-direct-children-list-query";
import { useOrgUnitTree } from "@/data/org_unit/use-org-unit-tree";
import { INDUSTRY_REQUEST_FIELDS } from "@/lib/constants";
import { IndustryRequestType } from "@/lib/enums";
import { formatSelectOptions } from "@/lib/utils";
import { IndustryRequestResponse } from "@/types/interfaces.industry_requests";
import { OrgUnitResponse } from "@/types/interfaces.org_units";
import {
  IndustryRequestCreateInput,
  industryRequestCreateSchema,
  industryRequestDefaultValues,
  IndustryRequestUpdateInput,
} from "@/validation/validation.industry_requests";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, UseFormReturn, useWatch } from "react-hook-form";
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

  const selectedType = useWatch({
    control: form.control,
    name: "type",
  }) as keyof typeof INDUSTRY_REQUEST_FIELDS;

  useEffect(() => {
    form.setValue("extra_data", {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType]);

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

      <FormTreeSelect form={form} />

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
        accept=".pdf,.doc,.docx,.zip,.png,.jpg" // Or leave blank for any file
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
            ? "Edit Request"
            : "Submit Request"}
      </Button>
    </form>
  );
};

const FormTreeSelect = ({
  form,
}: {
  form: UseFormReturn<IndustryRequestCreateInput>;
}) => {
  const {
    searchQuery,
    setSearchQuery,
    open,
    setOpen,
    isSearching,
    isLoading,
    results,
    selectedNode,
    handleSelect,
  } = useOrgUnitTree((id) => {
    form.setValue("academic_unit", id, {
      shouldValidate: true,
      shouldDirty: true,
    });
  });

  // Reusable child fetcher for the TreeView
  const useOrgUnitChildren: UseChildrenHook<OrgUnitResponse> = (
    node,
    enabled,
  ) => {
    return useGetOrgUnitDirectChildrenList({ parent_id: node.id }, enabled);
  };

  return (
    <Field>
      <FieldLabel htmlFor="academic_unit" className="capitalize">
        Academic Unit
        <Asterisk />
      </FieldLabel>

      <TreeSelect
        selectedId={form.getValues("academic_unit")}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        DisplaySelectedItem={
          <span className="truncate">
            {selectedNode ? selectedNode?.name : "Choose a unit..."}
          </span>
        }
        getHasChildren={(node) => node.total_subnodes > 0}
        getKey={(node) => node.id}
        isLoading={isLoading}
        results={results}
        isSearching={isSearching}
        renderItem={(node) => <TreeItem onSelect={handleSelect} node={node} />}
        open={open}
        setOpen={setOpen}
        useChildren={useOrgUnitChildren}
      />

      {form.formState.errors.academic_unit && (
        <FieldError errors={[form.formState.errors.academic_unit]} />
      )}
    </Field>
  );
};

const TreeItem = ({
  onSelect,
  node,
}: {
  onSelect?: (node: OrgUnitResponse) => void;
  node: OrgUnitResponse;
}) => (
  <div
    onClick={() => onSelect?.(node)}
    className="flex items-center gap-2 py-1 cursor-pointer grow"
  >
    <span className="font-medium text-sm truncate">{node.name}</span>
    <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] text-muted-foreground uppercase tracking-wider">
      {node.unit_type}
    </span>
  </div>
);

export default CreateEditIndustryRequestsForm;
