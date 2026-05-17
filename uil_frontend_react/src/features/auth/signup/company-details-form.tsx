import {
  FormCombobox,
  FormInput,
  FormSection,
  FormTextArea,
} from "@/components/reusable/form-components";
import { FieldGroup } from "@/components/ui/field";
import { IndustryType } from "@/lib/enums";
import { formatSelectOptions } from "@/lib/utils";
import { FieldValues, useFormContext } from "react-hook-form";

type Props = {
  actionType?: "create" | "update";
};

const CompanyDetailsForm = ({ actionType = "create" }: Props) => {
  const form = useFormContext<FieldValues>();

  return (
    <FieldGroup className="space-y-4">
      {/* --- Basic Information --- */}
      <FormSection
        title="Basic Information"
        description="General identity and industry classification."
      >
        <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
          <FormInput
            form={form}
            name="name"
            label="Company Name"
            placeholder="Enter company name"
            required
          />

          <FormCombobox
            form={form}
            name="industry_type"
            label="Industry Type"
            options={formatSelectOptions(Object.values(IndustryType))}
            placeholder="Select type"
            required
          />
        </div>
      </FormSection>

      {/* --- Contact Details --- */}
      <FormSection
        title="Contact Details"
        description="How the company can be reached internally and externally."
      >
        <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
          <FormInput
            type="email"
            form={form}
            name="industry_email"
            label="Company Email"
            placeholder="Enter company Email"
            disabled={actionType === "update"}
          />

          <FormInput
            form={form}
            name="phone_number"
            label="Company Phone Number"
            placeholder="Enter company Phone Number"
          />
        </div>
      </FormSection>

      {/* --- Location --- */}
      <FormSection
        title="Location"
        description="Physical presence and geographic data."
      >
        <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
          <FormInput
            form={form}
            name="location"
            label="City/Woreda"
            placeholder="Enter your city/woreda"
            required
          />

          <FormInput
            form={form}
            name="address"
            label="Physical Address"
            placeholder="Street, Building, Office No."
          />
        </div>
      </FormSection>

      {/* --- Additional Info --- */}
      <FormSection
        title="Additional Information"
        description="Operational scale and online presence."
      >
        <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
          <FormInput
            type="number"
            form={form}
            name="number_of_employees"
            label="Number of Employees"
            placeholder="Enter your number of employees"
          />

          <FormInput
            form={form}
            name="website"
            label="Website (Optional)"
            placeholder="Enter your website"
          />
        </div>

        <div className="mt-4">
          <FormTextArea
            form={form}
            name="description"
            label="Description"
            placeholder="Enter a description for your company"
          />
        </div>
      </FormSection>
    </FieldGroup>
  );
};

export default CompanyDetailsForm;
