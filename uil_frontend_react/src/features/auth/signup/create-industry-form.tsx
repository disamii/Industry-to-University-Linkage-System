import {
  FormInput,
  FormSelect,
  FormTextArea,
} from "@/components/reusable/form-components";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useIndustryCreateMutation } from "@/data/industry/industry-create-mutation";
import { IndustryType } from "@/lib/enums";
import { formatSelectOptions } from "@/lib/utils";
import {
  IndustryCreateInput,
  industryCreateSchema,
  industryDefaultValues,
} from "@/validation/validation.industry";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

// --- Sub-Component: Step 1 (Company) ---
const CompanyDetailsForm = () => {
  const form = useFormContext<IndustryCreateInput>();

  return (
    <FieldGroup>
      <FormInput
        form={form}
        name="name"
        label="Company Name"
        placeholder="Enter company name"
      />

      <FormSelect
        form={form}
        name="industry_type"
        label="Industry Type"
        options={formatSelectOptions(Object.values(IndustryType))}
        placeholder="Select type"
      />

      <div className="gap-2 grid grid-cols-1 md:grid-cols-2">
        <FormInput
          type="email"
          form={form}
          name="industry_email"
          label="Company Email"
          placeholder="Enter company Email"
        />

        <FormInput
          form={form}
          name="phone_number"
          label="Company Phone Number"
          placeholder="Enter phone number(+251...)"
        />
      </div>

      <FormTextArea
        form={form}
        name="description"
        label="Description"
        placeholder="Enter a description for your company"
      />

      <div className="gap-2 grid grid-cols-1 md:grid-cols-2">
        <FormInput
          form={form}
          name="location"
          label="Location (City)"
          placeholder="Enter your location (city)"
        />

        <FormInput
          form={form}
          name="address"
          label="Physical Address"
          placeholder="Street, Building, Office No."
        />
      </div>

      <div className="gap-2 grid grid-cols-1 md:grid-cols-2">
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
    </FieldGroup>
  );
};

// --- Sub-Component: Step 2 (Contact Person) ---
const ContactDetailsForm = () => {
  const form = useFormContext<IndustryCreateInput>();

  return (
    <FieldGroup>
      <FormInput
        form={form}
        name="contact_full_name"
        label="Full Name"
        placeholder="Enter contact person full name"
      />
      <FormInput
        type="email"
        form={form}
        name="contact_email"
        label="Email"
        placeholder="Enter contact person email"
      />
      <FormInput
        form={form}
        name="contact_person_phone_number"
        label="Phone Number"
        placeholder="Enter contact person phone number"
      />

      <div className="gap-2 grid grid-cols-1 md:grid-cols-2">
        <FormInput
          type="password"
          form={form}
          name="contact_password"
          label="Password"
          placeholder="Enter your password"
        />

        <FormInput
          type="password"
          form={form}
          name="confirm_password"
          label="Confirm Password"
          placeholder="Confirm your password"
        />
      </div>
    </FieldGroup>
  );
};

// --- Main Form Component ---
type CreateIndustryFormProps = {
  setStep: (step: number) => void;
};

const CreateIndustryForm = ({ setStep }: CreateIndustryFormProps) => {
  const { mutate, isPending } = useIndustryCreateMutation();
  const [subStep, setSubStep] = useState(1);

  const form = useForm<IndustryCreateInput>({
    resolver: zodResolver(industryCreateSchema),
    defaultValues: industryDefaultValues,
  });

  const handleNext = async () => {
    const isValid = await form.trigger([
      "name",
      "industry_email",
      "industry_type",
      "location",
      "address",
      "website",
      "phone_number",
      "number_of_employees",
      "description",
    ]);

    if (isValid) {
      setSubStep(2);
    }
  };

  const handleBack = () => {
    if (subStep === 2) {
      setSubStep(1);
    } else {
      setStep(1);
    }
  };

  const onSubmit = (data: IndustryCreateInput) => {
    mutate(data, {
      onSuccess: () => {
        form.reset();
        setStep(3);
      },
    });
  };

  return (
    <FormProvider {...form}>
      <form
        id="form-create-industry"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 w-96"
      >
        {subStep === 1 ? (
          <div className="animate-in fade-in">
            <h3 className="mb-4 font-bold text-lg">Company Profile</h3>
            <CompanyDetailsForm />
          </div>
        ) : (
          <div className="animate-in fade-in">
            <h3 className="mb-4 font-bold text-lg">Contact Person Account</h3>
            <ContactDetailsForm />
          </div>
        )}

        {/* Navigation Actions */}
        <div className="gap-3 grid grid-cols-2 pt-2">
          <Button
            variant="outline"
            type="button"
            onClick={handleBack}
            className="w-full h-10"
          >
            {subStep === 2 ? "Previous" : "Back to Role"}
          </Button>

          {subStep === 1 ? (
            <Button type="button" onClick={handleNext} className="w-full h-10">
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              form="form-create-industry"
              disabled={isPending}
              className="w-full h-10"
            >
              {isPending && <Spinner data-icon="inline-start" />}
              {isPending ? "Registering..." : "Complete Signup"}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default CreateIndustryForm;
