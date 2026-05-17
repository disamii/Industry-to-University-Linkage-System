import { FormInput } from "@/components/reusable/form-components";
import { FieldGroup } from "@/components/ui/field";
import { IndustryCreateInput } from "@/validation/validation.industry";
import { useFormContext } from "react-hook-form";

type Props = {
  showPasswordFields?: boolean;
};

const ContactDetailsForm = ({ showPasswordFields = true }: Props) => {
  const form = useFormContext<IndustryCreateInput>();

  return (
    <FieldGroup>
      <FormInput
        form={form}
        name="contact_full_name"
        label="Full Name"
        placeholder="Enter contact person full name"
        required
      />
      <FormInput
        type="email"
        form={form}
        name="contact_email"
        label="Email"
        placeholder="Enter contact person email"
        required
        disabled={!showPasswordFields}
      />
      <FormInput
        form={form}
        name="contact_person_phone_number"
        label="Phone Number"
        placeholder="Enter contact person phone number"
      />

      {showPasswordFields && (
        <div className="gap-2 grid grid-cols-1 md:grid-cols-2">
          <FormInput
            type="password"
            form={form}
            name="contact_password"
            label="Password"
            placeholder="Enter your password"
            required
          />

          <FormInput
            type="password"
            form={form}
            name="confirm_password"
            label="Confirm Password"
            placeholder="Confirm your password"
            required
          />
        </div>
      )}
    </FieldGroup>
  );
};

export default ContactDetailsForm;
